const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const countersModel = require('../../models/counters.model')
const locationsModel = require('../../models/locations.model')
const departmentModel = require('../../models/department.model')

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
const { userTypes, memberType, days ,locationNames } = require('../constants/GUC.enum')
//const { generateOTP, addPoints } = require('../helpers/helpers')
const { relativeTimeRounding } = require('moment')

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
    const { Account } = req.body

    const { id } = Account

    const account = await AccountModel.findById(id)
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

    const newacc = await AccountModel.findByIdAndUpdate(id, Account)
    console.log(newacc)
    console.log(Account)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
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
    const account = await AccountModel.findById(id)
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

    const account = await AccountModel.findById(id)
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
    account.salary = salary
    const newA = await AccountModel.findByIdAndUpdate(accountId, account)
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

    const account = await AccountModel.findById(id)
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
// const resend_token = async (req, res) => {
//   try {
//     const { token } = req.body
//     let data = {}
//     jwt.verify(token, secretOrKey, (err, authorizedData) => {
//       if (!err) {
//         data = authorizedData
//       } else {
//         return res.json({ code: errorCodes.authentication, error: 'breach' })
//       }
//     })
//     const account = await AccountModel.findOne({ where: { id: data.id } })
//     if (!account) {
//       return res.json({ statusCode: errorCodes.entityNotFound })
//     }
//     if (account.status === accountStatus.VERIFIED) {
//       const payLoad = {
//         id: account.id,
//         firstName: account.firstName,
//         lastName: account.lastName,
//         username: account.username,
//         phone: account.phone,
//         email: account.email,
//         status: account.status,
//         type: account.type,
//       }

//       const token = jwt.sign(payLoad, secretOrKey, {
//         expiresIn: '999999h',
//       })
//       return res.json({
//         token,
//         id: account.id,
//         username: account.username,
//         state: account.status,
//         statusCode: errorCodes.success,
//       })
//     } else {
//       return res.json({ statusCode: errorCodes.unVerified })
//     }
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

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

module.exports = {
  updateSalary,
  createAccount,
  login,
  firstLogin,
  change_password,
  deleteProfile,
  update_profile,
  get_profile,
}
