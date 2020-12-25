const accountsModel = require('../../models/account.model')
const attendanceModel = require('../../models/attendance.model')
const workAttendanceModel = require('../../models/workAttendance.model')
const { days } = require('../constants/GUC.enum')
const moment = require('moment')

const {
  unknown,
  accountNotFound,
  success,
  alreadySignedIn,
  haventSignedIn,
  alreadySignedOut,
  cantSignInAfter19,
  cantManualSignIn,
} = require('../constants/errorCodes')

//no signin abl el sa3a 7 law 3amlt signin ba3d 7 tetkteb 7 same for signout
const signIn = async (req, res) => {
  try {
    let accountId = req.body.Account.id
    let academicId = req.body.Account.academicId
    //make sure an account exits, not needed
    // const accountFound = await accountsModel.find({ _id: accountId })
    // console.log(accountFound)
    // if (!accountFound) {
    //   return res.json({
    //     statusCode: accountNotFound,
    //     error: 'Account not found!',
    //   })
    // }

    //Any signin before 7 is considered 7
    //making sure single digits are written 01,02 --> 09 for consitency
    let hour = `${
      moment().hour() < 7
        ? '07'
        : moment().hour() >= 7 && moment().hour() < 10
        ? '0' + moment().hour()
        : moment().hour()
    }`

    if (parseInt(hour) >= 19) {
      return res.json({
        statusCode: cantSignInAfter19,
        message: 'You cant sign in after 7 pm',
      })
    }

    //Any signin before 7 is considered 7 and ZERO minutes
    let min = `${
      moment().hour() < 7
        ? '00'
        : moment().minute() < 10
        ? '0' + moment().minute()
        : moment().minute()
    }`

    let day = `${
      parseInt(moment().date()) < 10
        ? '0' + parseInt(moment().date())
        : parseInt(moment().date())
    }`
    //.month() function returns the month-1
    let month = `${moment().month() + 1}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`
    let year = `${moment().year()}`

    const attendanceFound = await attendanceModel.find({
      academicId: academicId,
    })

    //signin once per day
    const filteredAttendance = attendanceFound.filter(
      (attendance) =>
        moment(attendance.signInTime).date() === moment().date() && //same day
        moment(attendance.signInTime).month() === moment().month() && //same month
        moment(attendance.signInTime).year() === moment().year() //sameyear
    )

    let canSignIn = true
    //You can only signin again, iff the it is your first time to signin today or if you have signed out today
    console.log(attendanceFound)
    for (i in filteredAttendance) {
      let attendance = filteredAttendance[i]
      //if you haven't signed out today
      if (attendance.signOutTime === '-1') {
        canSignIn = false
        break
      }
    }

    //if it is your first time to signin today
    if (filteredAttendance.length === 0 || canSignIn) {
      await attendanceModel.create({
        accountId: accountId,
        academicId: academicId,
        signInTime: `${year}-${month}-${day}T${hour}:${min}:00.0000`,
        signOutTime: '-1',
      })
      return res.json({ statusCode: success, message: 'Sign in successful' })
    } else {
      return res.json({
        statusCode: alreadySignedIn,
        message: 'You need to sign out first!',
      })
    }
  } catch (e) {
    console.log(e.message)
    return res.json({ statusCode: unknown, error: 'Something went wrong!' })
  }
}

const signOut = async (req, res) => {
  try {
    let accountId = req.body.Account.id
    let academicId = req.body.Account.academicId

    //make sure an account exits
    // const accountFound = await accountsModel.find({ _id: accountId })
    // if (!accountFound) {
    //   return res.json({
    //     statusCode: accountNotFound,
    //     error: 'Account not found!',
    //   })
    // }

    const attendanceFound = await attendanceModel.find({
      academicId: academicId,
    })

    //Any signin after 19 is considered 19
    //making sure single digits are written 01,02 --> 09 for consitency
    let hour = `${
      moment().hour() > 19
        ? '19'
        : moment().hour() >= 7 && moment().hour() < 10
        ? '0' + moment().hour()
        : moment().hour()
    }`
    console.log(parseInt(hour))
    if (parseInt(hour) < 7) {
      return res.json({
        statusCode: cantSignInAfter19,
        message: 'You cant sign out before 7 am',
      })
    }

    //Any signin before 7 is considered 7 and ZERO minutes
    let min = `${
      moment().hour() >= 19
        ? '00'
        : moment().minute() < 10
        ? '0' + moment().minute()
        : moment().minute()
    }`

    let day = `${
      parseInt(moment().date()) < 10
        ? '0' + parseInt(moment().date())
        : parseInt(moment().date())
    }`
    //.month() function returns the month-1
    let month = `${moment().month() + 1}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`
    let year = `${moment().year()}`

    //getting attendance for a the current day
    const filteredAttendance = attendanceFound.filter(
      (attendance) =>
        moment(attendance.signInTime).date() === moment().date() && //same day
        moment(attendance.signInTime).month() === moment().month() && //same month
        moment(attendance.signInTime).year() === moment().year() //sameyear
    )

    let canSignOut = false
    let signOutId = '-1'
    let signInTime = '-1'

    //You can only signin again, iff the it is your first time to signin today or if you have signed out today

    for (i in filteredAttendance) {
      let attendance = filteredAttendance[i]
      //if you haven't signed out today
      if (attendance.signOutTime === '-1') {
        canSignOut = true
        signOutId = attendance._id
        signInTime = attendance.signInTime
        break
      }
    }

    if (canSignOut) {
      await attendanceModel.updateOne(
        { _id: signOutId },
        {
          signOutTime: `${year}-${month}-${day}T${hour}:${min}:00.0000`,
        }
      )
      const addDay = filteredAttendance.length > 1 ? false : true

      const signOutTime = `${year}-${month}-${day}T${hour}:${min}:00.0000`
      workAttendance(
        academicId,
        moment().day(),
        month,
        year,
        signInTime,
        signOutTime,
        addDay
      )

      return res.json({ statusCode: success, message: 'Sign out successful' })
    } else {
      return res.json({
        statusCode: alreadySignedOut,
        error: 'You need to sign in first',
      })
    }
  } catch (e) {
    console.log(e.message)
    return res.json({ statusCode: unknown, error: 'Something went wrong!' })
  }
}

const manualSignIn = async (req, res) => {
  try {
    let { hour, minute, day, month, year } = req.body.Attendance
    let myAcademicId = req.body.Account.academicId
    let academicId = req.body.Attendance.academicId

    if (myAcademicId === academicId) {
      return res.json({
        statusCode: cantManualSignIn,
        message: 'You cant manual sign in to yourself',
      })
    }

    //Any signin before 7 is considered 7 and ZERO minutes
    minute = `${
      parseInt(hour) < 7
        ? '00'
        : parseInt(minute) < 10
        ? '0' + parseInt(minute)
        : parseInt(minute)
    }`

    hour = `${
      parseInt(hour) < 7
        ? '07'
        : parseInt(hour) >= 7 && parseInt(hour) < 10
        ? '0' + parseInt(hour)
        : parseInt(hour)
    }`

    if (parseInt(hour) >= 19) {
      return res.json({
        statusCode: cantSignInAfter19,
        message: 'You cant sign in after 7 pm',
      })
    }

    let min = minute

    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    //.month() function returns the month-1
    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`

    //make sure an account exits
    const accountFound = await accountsModel.find({ academicId: academicId })
    console.log(accountFound)
    if (!accountFound) {
      return res.json({
        statusCode: accountNotFound,
        error: 'Account not found!',
      })
    }
    const attendanceFound = await attendanceModel.find({
      academicId: academicId,
    })

    let canSignIn = true
    //You can only signin again, iff the it is your first time to signin today or if you have signed out today
    //if an attendance exists or the user can sign in, create otherwise reject
    const filteredAttendance = attendanceFound.filter(
      (attendance) =>
        moment(attendance.signInTime).date() === parseInt(day) && //same day
        moment(attendance.signInTime).month() + 1 === parseInt(month) && //same month
        moment(attendance.signInTime).year() === parseInt(year) //sameyear
    )

    for (i in filteredAttendance) {
      let attendance = filteredAttendance[i]

      //if you haven't signed out today
      if (attendance.signOutTime === '-1') {
        canSignIn = false
        break
      }
    }
    if (filteredAttendance.length === 0 || canSignIn) {
      await attendanceModel.create({
        academicId: academicId,
        signInTime: `${year}-${month}-${day}T${hour}:${min}:00.0000`,
        signOutTime: '-1',
      })
      return res.json({ statusCode: success, message: 'Sign in successful' })
    } else {
      return res.json({
        statusCode: alreadySignedIn,
        message: 'You need to sign out first!',
      })
    }
  } catch (e) {
    console.log(e.message)
    return res.json({ statusCode: unknown, error: 'Something went wrong!' })
  }
}

const manualSignOut = async (req, res) => {
  try {
    let { hour, minute, day, month, year } = req.body.Attendance
    let myAcademicId = req.body.Account.academicId
    let academicId = req.body.Attendance.academicId

    if (myAcademicId === academicId) {
      return res.json({
        statusCode: cantManualSignIn,
        message: 'You cant manual sign in to yourself',
      })
    }

    //Any signin before 7 is considered 7 and ZERO minutes
    // console.log(parseInt(hour))
    // minute = `${
    //   parseInt(hour) >= 19
    //     ? '00'
    //     : parseInt(minute) < 10
    //     ? '0' + parseInt(minute)
    //     : parseInt(minute)
    // }`

    //Any signin after 19 is considered 19
    //making sure single digits are written 01,02 --> 09 for consitency
    hour = `${
      parseInt(hour) >= 19
        ? '19'
        : parseInt(hour) >= 7 && parseInt(hour) < 10
        ? '0' + parseInt(hour)
        : parseInt(hour)
    }`

    if (parseInt(hour) < 7) {
      return res.json({
        statusCode: cantSignInAfter19,
        message: 'You cant sign out before 7 am',
      })
    }
    let min = minute
    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    //.month() function returns the month-1
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`

    //make sure an account exits
    const accountFound = await accountsModel.find({ academicId: academicId })
    if (!accountFound) {
      return res.json({
        statusCode: accountNotFound,
        error: 'Account not found!',
      })
    }
    const attendanceFound = await attendanceModel.find({
      academicId: academicId,
    })

    let signOutTime = `${year}-${month}-${day}T${hour}:${min}:00.0000`

    //getting attendance for a the current day
    const filteredAttendance = attendanceFound.filter(
      (attendance) =>
        moment(attendance.signInTime).date() === moment(signOutTime).date() && //same day
        moment(attendance.signInTime).month() === moment(signOutTime).month() && //same month
        moment(attendance.signInTime).year() === moment(signOutTime).year() //sameyear
    )

    let canSignOut = false
    let signOutId = '-1'
    let signInTime = '-1'

    //You can only signin again, iff the it is your first time to signin today or if you have signed out today

    for (i in filteredAttendance) {
      let attendance = filteredAttendance[i]

      //if you haven't signed out today
      if (attendance.signOutTime === '-1') {
        canSignOut = true
        signOutId = attendance._id
        signInTime = attendance.signInTime
        break
      }
    }

    if (canSignOut) {
      await attendanceModel.updateOne(
        { _id: signOutId },
        {
          signOutTime: `${year}-${month}-${day}T${hour}:${min}:00.0000`,
        }
      )
      console.log('asdas')
      console.log(filteredAttendance.length)
      const addDay = filteredAttendance.length > 1 ? false : true
      console.log(addDay)
      workAttendance(
        academicId,
        moment().day(),
        month,
        year,
        signInTime,
        signOutTime,
        addDay
      )

      return res.json({ statusCode: success, message: 'Sign out successful' })
    } else {
      return res.json({
        statusCode: alreadySignedOut,
        error: 'You need to sign out first!',
      })
    }
  } catch (e) {
    console.log(e.message)
    return res.json({ statusCode: unknown, error: 'Something went wrong!' })
  }
}

const workAttendance = async (
  academicId,
  day,
  month,
  year,
  signInTime,
  signOutTime,
  addDay
) => {
  let weekday = new Array(7)
  weekday[0] = days.SUNDAY
  weekday[1] = days.MONDAY
  weekday[2] = days.TUESDAY
  weekday[3] = days.WEDNESDAY
  weekday[4] = days.THURSDAY
  weekday[5] = days.FRIDAY
  weekday[6] = days.SATURDAY

  let hoursWorked = moment(signOutTime).diff(moment(signInTime), 'minutes') / 60

  const workAttendanceFound = await workAttendanceModel.find({
    academicId,
    month,
    year,
  })

  console.log(workAttendanceFound)

  //if record exists update else create
  if (workAttendanceFound.length !== 0) {
    //if today is a working day,+1 day and hours worked for that day
    //else only add worked hours

    //get days off
    let accountFound = await accountsModel.find({ academicId: academicId })

    let dayOff = accountFound.dayOff
    if (dayOff === weekday[5] || dayOff == weekday[day]) {
      //calculate the worked hours
      //'minutes' were used instead of 'hours' because in hours it round downs the minutes
      //update the record

      await workAttendanceModel.update(
        { academicId, month, year },
        {
          totalWorkedHours:
            workAttendanceFound[0].totalWorkedHours + hoursWorked,
        }
      )
      //if compensation add day and hours
    } else {
      //Not a day off, add working hours and if more than sign in add to day only once
      if (addDay) {
        console.log(workAttendanceFound[0].totalWorkedDays + 1)
        console.log(workAttendanceFound[0].totalWorkedHours + hoursWorked)

        await workAttendanceModel.update(
          { academicId: academicId, month: `${month}`, year: `${year}` },
          {
            totalWorkedDays: workAttendanceFound[0].totalWorkedDays + 1,
            totalWorkedHours:
              workAttendanceFound[0].totalWorkedHours + hoursWorked,
          }
        )
      } else {
        await workAttendanceModel.update(
          { academicId: academicId, month: month, year: year },
          {
            totalWorkedHours:
              workAttendanceFound[0].totalWorkedHours + hoursWorked,
          }
        )
      }
    }
  } else {
    await workAttendanceModel.create({
      academicId,
      month,
      year,
      totalWorkedDays: 1,
      totalWorkedHours: hoursWorked,
    })
    return success
  }
}
const viewMyAttendanceRecord = async (req, res) => {
  try {
    const attendance = req.body.Attendance
    const academicId = req.body.Account.academicId
    let accountId = req.body.Account.id

    //make sure an account exits, not needed
    // const accountFound = await accountsModel.find({ academicId: academicId })
    // if (!accountFound) {
    //   return res.json({
    //     statusCode: accountNotFound,
    //     error: 'Account not found!',
    //   })
    // }
    const startDate =
      attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
        ? moment(`${attendance.year}-${attendance.month}-11T00:00:00.0000`)
        : moment().set('date', 11).set('hours', 0).set('minutes', 0)

    //end date is either a month+startDate or if we haven't reached the end of the month
    //we will do our business days calculations and getting attendance docs
    //using the current date as the endDate
    const endDate = startDate.clone()
    endDate.add(1, 'month')

    if (
      attendance.hasOwnProperty('month') &&
      attendance.hasOwnProperty('year')
    ) {
      const attendanceFound = await attendanceModel.find({
        academicId: academicId,
      })

      const filteredAttendanceFound = attendanceFound.filter((attendance) =>
        moment(attendance.signInTime).isBetween(startDate, endDate)
      )
      // console.log(moment(attendance.signInTime))
      // console.log(startDate, 'start')
      // console.log(endDate, 'end')
      // console.log(moment(attendance.signInTime).isBetween(startDate, endDate))

      return res.json({
        statusCode: success,
        Attendance: filteredAttendanceFound,
      })
    } else {
      const attendanceFound = await attendanceModel.find({
        academicId: academicId,
      })

      let month = moment().month()
      let year = moment().year()

      const filteredAttendanceFound = attendanceFound.filter(
        (attendance) =>
          moment(attendance.signInTime).month() === month &&
          moment(attendance.signInTime).year() === year
      )

      return res.json({
        statusCode: success,
        Attendance: filteredAttendanceFound,
      })
    }
  } catch (e) {
    return res.json({ statusCode: unknown, error: 'Something went wrong!' })
  }
}
const viewStaffAttendanceRecord = async (req, res) => {
  try {
    const attendance = req.body.Attendance
    const academicId = req.body.Attendance.academicId
    let accountId = req.body.Account.id

    //make sure an account exits, not needed
    // const accountFound = await accountsModel.find({ academicId: academicId })
    // if (!accountFound) {
    //   return res.json({
    //     statusCode: accountNotFound,
    //     error: 'Account not found!',
    //   })
    // }
    const startDate =
      attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
        ? moment(`${attendance.year}-${attendance.month}-11T00:00:00.0000`)
        : moment().set('date', 11).set('hours', 0).set('minutes', 0)

    //end date is either a month+startDate or if we haven't reached the end of the month
    //we will do our business days calculations and getting attendance docs
    //using the current date as the endDate
    const endDate = startDate.clone()
    endDate.add(1, 'month')

    if (
      attendance.hasOwnProperty('month') &&
      attendance.hasOwnProperty('year')
    ) {
      const attendanceFound = await attendanceModel.find({
        academicId: academicId,
      })

      const filteredAttendanceFound = attendanceFound.filter((attendance) =>
        moment(attendance.signInTime).isBetween(startDate, endDate)
      )
      // console.log(moment(attendance.signInTime))
      // console.log(startDate, 'start')
      // console.log(endDate, 'end')
      // console.log(moment(attendance.signInTime).isBetween(startDate, endDate))

      return res.json({
        statusCode: success,
        Attendance: filteredAttendanceFound,
      })
    } else {
      const attendanceFound = await attendanceModel.find({
        academicId: academicId,
      })

      let month = moment().month()
      let year = moment().year()

      const filteredAttendanceFound = attendanceFound.filter(
        (attendance) =>
          moment(attendance.signInTime).month() === month &&
          moment(attendance.signInTime).year() === year
      )

      return res.json({
        statusCode: success,
        Attendance: filteredAttendanceFound,
      })
    }
  } catch (e) {
    return res.json({ statusCode: unknown, error: 'Something went wrong!' })
  }
}

//starts 11 and ends 10 of the month
//missing days=business working days in month - totalworkeddays-leavs
const viewMissingDays = async (req, res) => {
  try {
    let academicId = req.body.Attendance.academicId
    const attendance = req.body.Attendance

    //The start date and end date depend on the user input
    //if a user enters a month and a year, it is gonna be
    //used for our start date otherwise we will use the current month and year
    console.log(attendance.month)
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

    // const accountFound = await accountsModel.findById(accountId)

    const accountFound = await accountsModel.find({ academicId: academicId })

    if (!accountFound) {
      return res.json({
        statusCode: accountNotFound,
        error: 'Account not found!',
      })
    }

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

    console.log('attendance found')
    console.log(attendanceFound)

    //TODO
    const leavesDays = 0
    const workedDays = attendanceFound[0].totalWorkedDays
    const businessDays = getBusinessWorkingDays(
      startDate,
      endDate,
      accountFound[0].dayOff
    )
    console.log('woww')
    console.log(businessDays)
    console.log(workedDays)
    return res.json({
      statusCode: success,
      missingDays: businessDays - workedDays - leavesDays,
    })
  } catch (e) {
    console.log(e.message)
    return res.json({ statusCode: unknown, error: 'Something went wrong!' })
  }
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

const viewExtraMissingWorkedHours = async (req, res) => {
  const attendance = req.body.Attendance
  let academicId = req.body.Account.academicId

  const accountFound = await accountsModel.find({ academicId: academicId })
  if (!accountFound) {
    return res.json({
      statusCode: accountNotFound,
      error: 'Account not found!',
    })
  }

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

  console.log(attendanceFound)

  let myHours =
    attendanceFound[0].totalWorkedHours -
    attendanceFound[0].totalWorkedDays * 8.4

  if (myHours > 0) {
    return res.json({
      statusCode: success,
      message: 'You have extra worked hours',
      hours: myHours,
    })
  } else {
    return res.json({
      statusCode: success,
      message: 'You have missing working hours',
      hours: -1 * myHours,
    })
  }
}

const viewStaffWithMissingDaysHours = async (req, res) => {
  let attendance = req.body.Attendance

  let month =
    attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
      ? attendance.month
      : moment().month() + 1

  let year =
    attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
      ? attendance.year
      : moment().year()

  let accountsFound = await accountsModel.find()

  let listOfStaff = []

  accountsFound.map((account, index) => {
    const academicId = account.academicId
    const accountId = account._id
    //has missing days?
    if (hasMissingDays(academicId, { month: month, year: year }) > 0) {
      listOfStaff.push(accountsFound[index])
    }

    //has missing hours

    if (hasMissingHours(academicId, { month: month, year: year })) {
      listOfStaff.push(accountsFound[index])
    }
  })
  return res.json({ statusCode: success, listOfStaff })
}
const viewStaffWithMissingDays = async (req, res) => {
  let attendance = req.body.Attendance

  let month =
    attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
      ? attendance.month
      : moment().month() + 1

  let year =
    attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
      ? attendance.year
      : moment().year()

  let accountsFound = await accountsModel.find()

  let listOfStaff = []

  for (let i = 0; i < accountsFound.length; i++) {
    const account = accountsFound[i]
    const academicId = account.academicId
    const accountId = account._id
    //has missing days?
    const isMissing = await hasMissingDays(academicId, {
      month: month,
      year: year,
    })

    if (isMissing > 0) {
      console.log('here')
      console.log(accountsFound[i])
      listOfStaff.push(accountsFound[i])
    }
  }

  console.log(listOfStaff)
  return res.json({ statusCode: success, listOfStaff })
}
const viewStaffWithMissingHours = async (req, res) => {
  try {
    let attendance = req.body.Attendance

    let month =
      attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
        ? attendance.month
        : moment().month() + 1

    let year =
      attendance.hasOwnProperty('month') && attendance.hasOwnProperty('year')
        ? attendance.year
        : moment().year()

    let accountsFound = await accountsModel.find()

    let listOfStaff = []

    for (let i = 0; i < accountsFound.length; i++) {
      const account = accountsFound[i]
      const academicId = account.academicId
      const accountId = account._id

      //has missing hours
      const isMissing = await hasMissingHours(academicId, {
        month: month,
        year: year,
      })

      console.log('academic', academicId, '  ', isMissing)

      if (isMissing) {
        listOfStaff.push(accountsFound[i])
      }
    }
    return res.json({ statusCode: success, listOfStaff })
  } catch (e) {
    console.log(e.message)
    return res.json({ statusCode: unknown, error: 'Something went wrong!' })
  }
}

const hasMissingDays = async (academicId, attendance) => {
  //The start date and end date depend on the user input
  //if a user enters a month and a year, it is gonna be
  //used for our start date otherwise we will use the current month and year
  console.log(attendance.month)
  const startDate = moment(
    `${attendance.year}-${attendance.month}-11T00:00:00.0000`
  )

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

  if (!accountFound) {
    return res.json({
      statusCode: accountNotFound,
      error: 'Account not found!',
    })
  }

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

  if (attendanceFound.length === 0) {
    return 22
  }

  //TODO
  const leavesDays = 0
  const workedDays = attendanceFound[0].totalWorkedDays
  const businessDays = getBusinessWorkingDays(
    startDate,
    endDate,
    accountFound[0].dayOff
  )

  console.log(businessDays)

  return businessDays - workedDays - leavesDays
}
const hasMissingHours = async (academicId, attendance) => {
  const accountFound = await accountsModel.find({ academicId: academicId })
  if (!accountFound) {
    return res.json({
      statusCode: accountNotFound,
      error: 'Account not found!',
    })
  }

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
  console.log('hereeee')
  console.log(attendanceFound)
  if (attendanceFound.length === 0) return true

  let myHours =
    attendanceFound[0].totalWorkedHours -
    attendanceFound[0].totalWorkedDays * 8.4
  console.log('hrs', myHours)
  if (myHours > 0) {
    return false
  } else {
    return true
  }
}

module.exports = {
  signIn,
  signOut,
  manualSignIn,
  manualSignOut,
  viewMyAttendanceRecord,
  viewStaffAttendanceRecord,
  viewStaffWithMissingDaysHours,
  viewMissingDays,
  viewExtraMissingWorkedHours,
  viewStaffWithMissingHours,
  viewStaffWithMissingDays,
}
