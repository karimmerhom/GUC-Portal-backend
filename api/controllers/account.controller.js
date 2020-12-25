const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const countersModel = require('../../models/counters.model')
const locationsModel = require('../../models/locations.model')
const departmentModel = require('../../models/department.model')
const workAttendanceModel = require('../../models/workAttendance.model')
const cron = require('cron')

const errorCodes = require('../constants/errorCodes')
const {
  secretOrKey,
  smsAccessKey,
  emailAccessKey,
  frontEndLink,
  LirtenKey,
  powerSupportSMSLink,
  powerSupportEmailLink,
} = require('../../config/keys')
const {
  userTypes,
  memberType,
  days,
  locationNames,
} = require('../constants/GUC.enum')
//const { generateOTP, addPoints } = require('../helpers/helpers')
const moment = require('moment')
const { findOne, findByIdAndUpdate } = require('../../models/account.model')
const accountsModel = require('../../models/account.model')
const attendanceModel = require('../../models/attendance.model')

const createAccount = async (req, res) => {
  try {
    const { Account } = req.body
    const findEmail = await AccountModel.findOne({
      email: Account.email.toString().toLowerCase(),
    })
    if (findEmail) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Email already exists',
      })
    }
    const id = await generateId(Account.type)
    const findPhone = await AccountModel.findOne({
      phoneNumber: Account.phoneNumber,
    })
    if (findPhone) {
      return res.json({
        statusCode: errorCodes.phoneExists,
        error: 'Phone number already exists',
      })
    }

    const department = await departmentModel.findOne({
      name: Account.department,
    })
    if (!department) {
      return res.json({
        statusCode: errorCodes.departmentDoesnotExist,
        error: 'department Does not Exist',
      })
    }

    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync('123456', saltKey)

    const x = await firstAssignLocation(Account.office, id)
    if (x === 101) {
      return res.json({
        statusCode: 101,
        error: 'this office does not  exist',
      })
    }

    if (x === 201) {
      return res.json({
        statusCode: 201,
        error: 'office is full',
      })
    }

    if (x === 400) {
      return res.json({
        statusCode: 5555,
        error: 'No office',
      })
    } else {
      const nextmonth = moment().set('date', 1).add(1, 'month') //to set cron to one month
      var dt = new Date() //sets cron to one min for testing
      dt.setMinutes(dt.getMinutes() + 2)
      console.log(dt.getMinutes())

      const scheduleJob = cron.job(dt, async () => {
        addAnnual(id)
      })
      scheduleJob.start()

      const nextYear = moment().add(1, 'year') //to set cron to one year
      var dt1 = new Date() //sets cron to one min for testing
      dt1.setMinutes(dt1.getMinutes() + 10)

      const scheduleJob1 = cron.job(dt1, async () => {
        newAccidental(id)
      })
      scheduleJob1.start()

      const accountCreated = await AccountModel.create({
        //username: Account.username.toString().toLowerCase(),
        academicId: id,
        password: hashed_pass,
        firstName: Account.firstName,
        lastName: Account.lastName,
        phoneNumber: Account.phoneNumber,
        email: Account.email.toString().toLowerCase(),
        type: Account.type,
        memberType: Account.memberType,
        daysOff: Account.daysOff,
        gender: Account.gender,
        salary: Account.salary,
        office: Account.office,
        department: Account.department,
        annualLeavesBalance: 5,
        accidentalBalance: 6,
      })

      return res.json({ statusCode: errorCodes.success })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const update_profile = async (req, res) => {
  try {
    const Account = req.body.AccountUpdated

    const academicId = req.body.Account.academicId

    const account = await AccountModel.findOne({
      academicId: academicId,
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'User not found',
      })
    }
    if (Account.email) {
      const findEmail = await AccountModel.findOne({
        email: Account.email.toString().toLowerCase(),
      })
      if (findEmail) {
        return res.json({
          statusCode: errorCodes.emailExists,
          error: 'Email already exists',
        })
      }
    }
    if (Account.phoneNumber) {
      const findPhone = await AccountModel.findOne({
        phoneNumber: Account.phoneNumber,
      })
      if (findPhone) {
        return res.json({
          statusCode: errorCodes.phoneExists,
          error: 'Phone number already exists',
        })
      }
    }

    if (Account.office) {
      const x = await firstAssignLocation(Account.office, account.id)
      if (x === 101) {
        return res.json({
          statusCode: 101,
          error: 'this office does not  exist',
        })
      }

      if (x === 201) {
        return res.json({
          statusCode: 201,
          error: 'office is full',
        })
      }

      if (x === 400) {
        return res.json({
          statusCode: 5555,
          error: 'No office',
        })
      }
    }

    const newacc = await AccountModel.findByIdAndUpdate(account.id, Account)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const login = async (req, res) => {
  try {
    const { Account } = req.body

    const account = await AccountModel.findOne({
      email: Account.email.toString().toLowerCase(),
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'No such Email',
      })
    }

    // if (account.status === accountStatus.PENDING) {
    //   return res.json({ statusCode: errorCodes.unVerified })
    // }
    const match = bcrypt.compareSync(Account.password, account.password)
    if (!match) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'Wrong Credentials',
      })
    }

    const first = Account.password === '123456'
    console.log(first)
    if (first) {
      return res.json({
        statusCode: errorCodes.firstLogin,
        error: 'Please change password first',
      })
    }

    const payLoad = {
      id: account.id,
      academicId: account.academicId,
      firstName: account.firstName,
      lastName: account.lastName,
      phoneNumber: account.phoneNumber,
      email: account.email.toString().toLowerCase(),
      type: account.type,
      memberType: account.memberType,
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '8h',
    })

    return res.json({
      statusCode: errorCodes.success,
      token,
      id: account.id,
      username: account.email,
      type: account.type,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const firstLogin = async (req, res) => {
  try {
    const { Account } = req.body
    const newPassword = req.body.newPassword
    const account = await AccountModel.findOne({
      email: Account.email.toString().toLowerCase(),
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'No such Email',
      })
    }

    // if (account.status === accountStatus.PENDING) {
    //   return res.json({ statusCode: errorCodes.unVerified })
    // }
    const match = bcrypt.compareSync(Account.password, account.password)
    if (!match) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'Wrong Credentials',
      })
    }

    if (newPassword === '123456') {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'Password cannot be same as old password or 123456',
      })
    }

    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(newPassword, saltKey)
    account.password = hashed_pass

    await AccountModel.findByIdAndUpdate(account.id, account)

    const payLoad = {
      id: account.id,
      academicId: account.academicId,
      firstName: account.firstName,
      lastName: account.lastName,
      phoneNumber: account.phoneNumber,
      email: account.email.toString().toLowerCase(),
      type: account.type,
      memberType: account.memberType,
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '8h',
    })

    return res.json({
      statusCode: errorCodes.success,
      token,
      id: account.id,
      username: account.email,
      type: account.type,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const change_password = async (req, res) => {
  try {
    const { Credentials, Account } = req.body

    const { academicId, id } = Account
    const account = await AccountModel.findOne({
      academicId: Account.academicId,
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.usernameExists,
        error: 'User does not exist',
      })
    }

    if (account.password !== null) {
      const match = bcrypt.compareSync(
        Credentials.oldPassword,
        account.password
      )
      if (!match) {
        return res.json({
          statusCode: errorCodes.invalidCredentials,
          error: 'Old password is wrong',
        })
      }
    }
    if (Credentials.newPassword === Credentials.password) {
      return res.json({
        statusCode: errorCodes.SamePassword,
        error: 'New password cannot be like old password',
      })
    }
    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Credentials.newPassword, saltKey)

    await AccountModel.findByIdAndUpdate(id, { password: hashed_pass })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const get_profile = async (req, res) => {
  //TODO
  try {
    const { Account } = req.body

    const { id } = Account

    const account = await AccountModel.findOne({
      academicId: Account.academicId,
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'User not found',
      })
    }
    const password = account.password
    let profile = account
    profile.password = '********'

    return res.json({
      statusCode: errorCodes.success,
      profile: profile,
      hasPassword: password !== null,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const updateSalary = async (req, res) => {
  //TODO
  try {
    const { Account } = req.body

    const { academicId } = Account
    const salary = req.body.salary

    const account = await AccountModel.find({ academicId: academicId })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'User not found',
      })
    }

    const newA = await AccountModel.update(
      { academicId: academicId },
      { salary: salary }
    )
    return res.json({
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const deleteProfile = async (req, res) => {
  //TODO
  try {
    const { Account } = req.body

    const { id } = Account

    const account = await AccountModel.findOne({
      academicId: Account.academicId,
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'User not found',
      })
    }

    await AccountModel.findByIdAndDelete(id)

    return res.json({
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const calculateMySalary = async (req, res) => {
  try {
    const Account = req.body.Account
    const academicId = Account.academicId
    const Attendance = req.body.Attendance
    const account = await accountsModel.findOne({ academicId: academicId })
    let baseSalary = account.salary

    let extraHours = await viewExtraMissingWorkedHoursHelper(
      academicId,
      Attendance
    )

    const missedDays = await viewMissingDaysHelper(academicId, Attendance)
    console.log('extra/missed')

    var missedDaysDeduction = missedDays * (baseSalary / 60)
    var missedHoursDeduction = 0

    if (extraHours <= 3) {
      missedHoursDeduction = extraHours * (baseSalary / 180)
    }

    if (extraHours > 0) {
      extraHours = extraHours * (baseSalary / 180)
    }

    const totalSalary =
      baseSalary - missedDaysDeduction + missedHoursDeduction + extraHours

    return res.json({
      statusCode: errorCodes.success,
      salary: totalSalary,
    })
  } catch (exception) {
    console.log(exception)
    return 400
  }
}
const calculateSalary = async (req, res) => {
  //HRRR
  try {
    const Account = req.body.Account
    const academicId = req.body.academicId
    const Attendance = req.body.Attendance
    const account = await accountsModel.findOne({ academicId: academicId })
    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'Account not found',
      })
    }
    const baseSalary = account.salary

    let extraHours = await viewExtraMissingWorkedHoursHelper(
      academicId,
      Attendance
    )
    const missedDays = await viewMissingDaysHelper(academicId, Attendance)

    var missedDaysDeduction = missedDays * (baseSalary / 60)
    var missedHoursDeduction = 0

    if (extraHours <= 3) {
      missedHoursDeduction = extraHours * (baseSalary / 180)
    }
    if (extraHours > 0) {
      extraHours = extraHours * (baseSalary / 180)
    }

    const totalSalary =
      baseSalary - missedDaysDeduction + missedHoursDeduction + extraHours

    return res.json({
      statusCode: errorCodes.success,
      salary: totalSalary,
    })
  } catch (exception) {
    console.log(exception)
    return 400
  }
}
const generateId = async (type) => {
  if (type === userTypes.HR) {
    let counterHR = await countersModel.findOne({ name: userTypes.HR })
    if (!counterHR) {
      await countersModel.create({ name: userTypes.HR, value: 1 })
      return 'hr-1'
    } else {
      let value = counterHR.value
      counterHR.value = counterHR.value + 1
      await countersModel.findByIdAndUpdate(counterHR.id, counterHR)
      return 'hr-' + value
    }
  }

  if (type === userTypes.ACADEMICMEMBER) {
    let counterAC = await countersModel.findOne({
      name: userTypes.ACADEMICMEMBER,
    })
    if (!counterAC) {
      await countersModel.create({ name: userTypes.ACADEMICMEMBER, value: 1 })
      return 'hr-1'
    } else {
      let value = counterAC.value
      counterAC.value = counterAC.value + 1
      await countersModel.findByIdAndUpdate(counterAC.id, counterAC)
      return 'ac-' + value
    }
  }

  return null
}
const addAnnual = async (academicId) => {
  console.log('New MONTH!!')
  const account = await accountsModel.findOne({ academicId: academicId })
  account.annualLeavesBalance = account.annualLeavesBalance + 2.5
  const newAcc = await accountsModel.findByIdAndUpdate(account.id, account)

  const nextmonth = moment().set('date', 1).add(1, 'month') //to set cron to one month
  const nextMin = '1 * * * *'

  var dt = new Date()
  dt.setMinutes(dt.getMinutes() + 2) //sets cron to one min for testing
  console.log(dt.getMinutes())

  const scheduleJob = cron.job(dt, async () => {
    addAnnual(id)
  })
  scheduleJob.start()
}

const newAccidental = async (academicId) => {
  console.log('New YEAR!!')
  const account = await accountsModel.findOne({ academicId: academicId })
  account.accidentalBalance = 6
  const newAcc = await accountsModel.findByIdAndUpdate(account.id, account)

  const nextYear = moment().add(1, 'year') //to set cron to one year
  var dt1 = new Date() //sets cron to one min for testing
  dt1.setMinutes(dt1.getMinutes() + 10)

  const scheduleJob1 = cron.job(dt1, async () => {
    newAccidental(id)
  })
  scheduleJob1.start()
}
const firstAssignLocation = async (location, academicId) => {
  try {
    const locationFound = await locationsModel.findOne({
      name: location,
      type: locationNames.OFFICE,
    })
    console.log(locationFound)

    if (!locationFound) {
      return 101
    }

    if (locationFound.MaxCapacity == locationFound.capacity) {
      return 201
    }
    locationFound.capacity = locationFound.capacity + 1
    locationFound.list.push(academicId)
    await locationsModel.findByIdAndUpdate(locationFound.id, locationFound)

    return 0
  } catch (exception) {
    console.log(exception)
    return 400
  }
}

const viewMissingDaysHelper = async (academicId, attendance) => {
  //The start date and end date depend on the user input
  //if a user enters a month and a year, it is gonna be
  //used for our start date otherwise we will use the current month and year
  const startDate =
    attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
      ? moment(`${attendance.year}-${attendance.month}-11T00:00:00.0000`)
      : moment().set('date', 11).set('hours', 0).set('minutes', 0)

  //end date is either a month+startDate or if we haven't reached the end of the month
  //we will do our business days calculations and getting attendance docs
  //using the current date as the endDate
  const tempDate = startDate.clone()

  tempDate.add(1, 'month')

  const endDate = moment().isBefore(tempDate) ? moment() : tempDate

  console.log(
    `startDate: ${startDate},,,, endDate: ${endDate},,,,, tempDate: ${tempDate}`
  )

  const accountFound = await accountsModel.find({ academicId: academicId })

  const attendanceFound = await workAttendanceModel.find({
    academicId: academicId,
    month:
      attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
        ? `${attendance.month}`
        : `${moment().month() + 1}`,
    year:
      attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
        ? `${attendance.year}`
        : `${moment().year()}`,
  })

  attendanceFound.length === 0

  console.log('attendance found')
  console.log(attendanceFound)

  //TODO
  const leavesDays = 0
  const workedDays =
    attendanceFound.length === 0 ? 0 : attendanceFound[0].totalWorkedDays
  const businessDays = getBusinessWorkingDays(
    startDate,
    endDate,
    accountFound[0].dayOff
  )
  console.log('woww')
  console.log(businessDays)
  console.log(workedDays)
  return businessDays - workedDays - leavesDays
}
const getBusinessWorkingDays = (startDate, endDate, dayOff) => {
  let weekday = new Array(7)
  weekday[0] = days.SUNDAY
  weekday[1] = days.MONDAY
  weekday[2] = days.TUESDAY
  weekday[3] = days.WEDNESDAY
  weekday[4] = days.THURSDAY
  weekday[5] = days.FRIDAY
  weekday[6] = days.SATURDAY

  let businessDays = 0

  while (startDate.isBefore(endDate)) {
    if (
      !(
        weekday[startDate.day()] === dayOff ||
        weekday[startDate.day()] === weekday[5]
      )
    ) {
      businessDays++
    }
    startDate.add(1, 'days')
  }
  return businessDays
}

const viewExtraMissingWorkedHoursHelper = async (academicId, attendance) => {
  // console.log(accountFound)

  const attendanceFound = await workAttendanceModel.find({
    academicId: academicId,
    month:
      attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
        ? attendance.month
        : moment().month() + 1,
    year:
      attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
        ? attendance.year
        : moment().year(),
  })

  if (attendanceFound.length === 0) {
    return 0
  }

  let myHours =
    attendanceFound[0].totalWorkedHours -
    attendanceFound[0].totalWorkedDays * 8.4

  if (myHours > 0) {
    return myHours
  } else {
    return myHours
  }
}

module.exports = {
  calculateMySalary,
  calculateSalary,
  updateSalary,
  createAccount,
  login,
  firstLogin,
  change_password,
  deleteProfile,
  update_profile,
  get_profile,
}
