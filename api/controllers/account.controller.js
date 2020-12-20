const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const countersModel = require('../../models/counters.model')

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
const { userTypes, memberType, days } = require('../constants/GUC.enum')
//const { generateOTP, addPoints } = require('../helpers/helpers')
const { relativeTimeRounding } = require('moment')

const register = async (req, res) => {
  try {
    const { Account } = req.body
    const findEmail = await AccountModel.findOne({
      email: Account.email.toString().toLowerCase(),
    })
    console.log(findEmail)
    if (findEmail) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Email already exists',
      })
    }
    const id = await generateId(Account.type)
    const findPhone = await AccountModel.findOne({
      phone: Account.phoneNumber,
    })
    if (findPhone) {
      return res.json({
        statusCode: errorCodes.phoneExists,
        error: 'Phone number already exists',
      })
    }

    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync('123456', saltKey)
    const accountCreated = await AccountModel.create({
      //username: Account.username.toString().toLowerCase(),
      academicId: id,
      password: hashed_pass,
      firstName: Account.firstName,
      lastName: Account.lastName,
      phone: Account.phoneNumber,
      email: Account.email.toString().toLowerCase(),
      type: Account.type,
      memberType: Account.memberType,
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

// const update_profile = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const { id } = req.data
//     if (parseInt(id) !== parseInt(Account.id)) {
//       return res.json({
//         statusCode: errorCodes.authentication,
//         error: 'breach',
//       })
//     }
//     const account = await AccountModel.findOne({
//       where: {
//         id: parseInt(id),
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'User not found',
//       })
//     }

//     AccountModel.update(Account, { where: { id } })
//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const verify = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const account = await AccountModel.findOne({
//       where: {
//         id: parseInt(Account.id),
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.entityNotFound,
//         error: 'User not found',
//       })
//     }
//     if (account.status === accountStatus.VERIFIED) {
//       return res.json({
//         statusCode: errorCodes.alreadyVerified,
//         error: 'Already verified',
//       })
//     }
//     const code = await generateOTP()
//     await VerificationCode.update(
//       {
//         smsCode: code,
//         smsDate: new Date(),
//       },
//       { where: { accountId: Account.id } }
//     )

//     axios({
//       method: 'post',
//       url: powerSupportSMSLink, //TODO
//       data: {
//         header: {
//           accessKey: smsAccessKey,
//         },
//         body: {
//           receiverPhone: account.phone,
//           body: code,
//         },
//       },
//     })
//       .then((res) => console.log(res))
//       .catch((err) => console.log(err.response.data.body.err))

//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const verify_email = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const account = await AccountModel.findOne({ where: { id: Account.id } })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.entityNotFound,
//         error: 'User not found',
//       })
//     }
//     if (account.emailVerified) {
//       return res.json({
//         statusCode: errorCodes.alreadyVerified,
//         error: 'Email already verified',
//       })
//     }
//     const code = await generateOTP()
//     await VerificationCode.update(
//       {
//         emailCode: code,
//         emailDate: new Date(),
//       },
//       { where: { accountId: Account.id } }
//     )
//     console.log(frontEndLink)
//     const link =
//       `${frontEndLink}/emailVerification?code=` + code + '&id=' + account.id
//     axios({
//       method: 'post',
//       url: powerSupportEmailLink, //TODO
//       data: {
//         header: {
//           accessKey: emailAccessKey,
//         },
//         body: {
//           receiverMail: account.email,
//           body: link,
//           subject: 'Verify your email',
//         },
//       },
//     })
//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }
// const verify_confirm_email = async (req, res) => {
//   try {
//     const { Account } = req.body
//     const account = await AccountModel.findOne({
//       where: { id: Account.id },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.entityNotFound,
//         error: 'Account not found',
//       })
//     }
//     const checkCodeExpired = await VerificationCode.findOne({
//       where: { accountId: Account.id, emailCode: Account.code },
//     })
//     if (!checkCodeExpired) {
//       return res.json({
//         statusCode: errorCodes.wrongVerificationCode,
//         error: 'Wrong verification code',
//       })
//     }
//     const date1 = new Date(checkCodeExpired.emailDate)
//     const date2 = new Date()
//     console.log(date1)
//     const diffTime = Math.abs(date2 - date1)
//     if (diffTime > 86400000) {
//       return res.json({
//         statusCode: errorCodes.verificationCodeExpired,
//         error: 'This is code has expired',
//       })
//     }
//     if (account.emailVerified) {
//       return res.json({
//         statusCode: errorCodes.alreadyVerified,
//         error: 'Already verified',
//       })
//     }
//     await AccountModel.update(
//       { emailVerified: true },
//       { where: { id: Account.id } }
//     )

//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const login = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const account = await AccountModel.findOne({
//       where: {
//         [Op.or]: {
//           username: Account.username.toString().toLowerCase(),
//           email: Account.username.toString().toLowerCase(),
//           phone: Account.username,
//         },
//       },
//     })

//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'Wrong Credentials',
//       })
//     }

//     if (account.status === accountStatus.SUSPENDED) {
//       return res.json({
//         statusCode: errorCodes.alreadySuspended,
//         error: 'Account suspended',
//       })
//     }

//     // if (account.status === accountStatus.PENDING) {
//     //   return res.json({ statusCode: errorCodes.unVerified })
//     // }
//     const match = bcrypt.compareSync(Account.password, account.password)
//     if (!match) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'Wrong Credentials',
//       })
//     }

//     const payLoad = {
//       id: account.id,
//       firstName: account.firstName,
//       lastName: account.lastName,
//       username: account.username,
//       phone: account.phone,
//       email: account.email,
//       status: account.status,
//       type: account.type,
//       emailVerified: account.emailVerified,
//     }

//     const token = jwt.sign(payLoad, secretOrKey, {
//       expiresIn: '8h',
//     })

//     return res.json({
//       statusCode: errorCodes.success,
//       token,
//       id: account.id,
//       username: account.username,
//       state: account.status,
//       emailVerified: account.emailVerified,
//     })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const login_admin = async (req, res) => {
//   try {
//     const { Account } = req.body
//     const account = await AccountModel.findOne({
//       where: {
//         [Op.or]: {
//           username: Account.username.toString().toLowerCase(),
//           email: Account.username.toString().toLowerCase(),
//           phone: Account.username,
//         },
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'Wrong Credentials',
//       })
//     }
//     if (account.type !== userTypes.ADMIN) {
//       return res.json({
//         statusCode: errorCodes.adminOnlyAccess,
//         error: 'Wrong Credentials',
//       })
//     }

//     if (account.status === accountStatus.SUSPENDED) {
//       return res.json({
//         statusCode: errorCodes.alreadySuspended,
//         error: 'Account suspended',
//       })
//     }
//     const match = bcrypt.compareSync(Account.password, account.password)
//     if (!match) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'Wrong Credentials',
//       })
//     }

//     const payLoad = {
//       id: account.id,
//       firstName: account.firstName,
//       lastName: account.lastName,
//       username: account.username,
//       phone: account.phone,
//       email: account.email,
//       status: account.status,
//       type: account.type,
//       emailVerified: account.emailVerified,
//     }

//     const token = jwt.sign(payLoad, secretOrKey, {
//       expiresIn: '8h',
//     })

//     return res.json({
//       statusCode: errorCodes.success,
//       token,
//       id: account.id,
//       username: account.username,
//       state: account.status,
//       emailVerified: account.emailVerified,
//     })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const confirm_verify = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const account = await AccountModel.findOne({
//       where: {
//         id: Account.id,
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'User not found',
//       })
//     }
//     if (account.status === accountStatus.VERIFIED) {
//       return res.json({
//         statusCode: errorCodes.alreadyVerified,
//         error: 'Already verified',
//       })
//     }
//     const checkCodeExpired = await VerificationCode.findOne({
//       where: { accountId: Account.id, smsCode: Account.code },
//     })
//     if (!checkCodeExpired) {
//       return res.json({
//         statusCode: errorCodes.wrongVerificationCode,
//         error: 'Wrong verification code',
//       })
//     }
//     const date1 = new Date(checkCodeExpired.smsDate)
//     const date2 = new Date()
//     console.log(date1)
//     const diffTime = Math.abs(date2 - date1)
//     if (diffTime > 86400000) {
//       return res.json({
//         statusCode: errorCodes.verificationCodeExpired,
//         error: 'This is code has expired',
//       })
//     }
//     if (account.status === accountStatus.VERIFIED) {
//       return res.json({
//         statusCode: errorCodes.alreadyVerified,
//         error: 'Already verified',
//       })
//     }

//     await AccountModel.update(
//       {
//         status: accountStatus.VERIFIED,
//       },
//       {
//         where: {
//           id: Account.id,
//         },
//       }
//     )
//     return res.json({
//       statusCode: errorCodes.success,
//       state: accountStatus.VERIFIED,
//     })
//   } catch (exception) {
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const change_password = async (req, res) => {
//   try {
//     const { Credentials, Account } = req.body

//     const { id } = Account
//     const account = await AccountModel.findOne({
//       where: {
//         id: parseInt(id, 10),
//       },
//     })
//     if (account.password !== null) {
//       const match = bcrypt.compareSync(Credentials.password, account.password)
//       if (!match) {
//         return res.json({
//           statusCode: errorCodes.invalidCredentials,
//           error: 'Old password is wrong',
//         })
//       }
//     }
//     if (Credentials.newPassword === Credentials.password) {
//       return res.json({
//         statusCode: errorCodes.SamePassword,
//         error: 'New password cannot be like old password',
//       })
//     }
//     const saltKey = bcrypt.genSaltSync(10)
//     const hashed_pass = bcrypt.hashSync(Credentials.newPassword, saltKey)
//     await AccountModel.update(
//       {
//         password: hashed_pass,
//       },
//       {
//         where: {
//           id: parseInt(id),
//         },
//       }
//     )
//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const change_email = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const { id } = Account
//     const found = await AccountModel.findOne({
//       where: { email: Account.email },
//     })
//     if (found) {
//       if (found.id === parseInt(id)) {
//         return res.json({ statusCode: errorCodes.success })
//       }
//       return res.json({
//         statusCode: errorCodes.emailExists,
//         error: 'Email Already exists',
//       })
//     }
//     await AccountModel.update(
//       {
//         email: Account.email,
//         emailVerified: false,
//       },
//       {
//         where: {
//           id: parseInt(id),
//         },
//       }
//     )
//     const emailCode = await generateOTP()
//     await VerificationCode.update(
//       { emailCode, emailDate: new Date() },
//       {
//         where: {
//           accountId: Account.id,
//         },
//       }
//     )
//     const link =
//       `${frontEndLink}/emailVerification?code=` +
//       emailCode +
//       '&id=' +
//       Account.id
//     axios({
//       method: 'post',
//       url: powerSupportEmailLink, //TODO
//       data: {
//         header: {
//           accessKey: emailAccessKey,
//         },
//         body: {
//           receiverMail: Account.email,
//           body: link,
//           subject: 'Verify your email',
//         },
//       },
//     })
//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const change_phone = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const { id } = Account
//     const found = await AccountModel.findOne({
//       where: { phone: Account.phoneNumber },
//     })

//     if (found) {
//       if (found.id === parseInt(id)) {
//         return res.json({ statusCode: errorCodes.success })
//       }
//       return res.json({
//         statusCode: errorCodes.emailExists,
//         error: 'Phone Already exists',
//       })
//     }
//     const code = await generateOTP()
//     await VerificationCode.update(
//       {
//         smsCode: code,
//         smsDate: new Date(),
//       },
//       { where: { accountId: Account.id } }
//     )
//     axios({
//       method: 'post',
//       url: powerSupportSMSLink, //TODO
//       data: {
//         header: {
//           accessKey: smsAccessKey,
//         },
//         body: {
//           receiverPhone: Account.phoneNumber,
//           body: code,
//         },
//       },
//     })
//     await AccountModel.update(
//       {
//         phone: Account.phoneNumber,
//         status: accountStatus.PENDING,
//       },
//       {
//         where: {
//           id: parseInt(id),
//         },
//       }
//     )

//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const forget_password = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const account = await AccountModel.findOne({
//       where: {
//         phone: Account.phoneNumber,
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'Phone not found',
//       })
//     }

//     const code = await generateOTP()
//     await VerificationCode.create({
//       code,
//       date: new Date(),
//     })

//     const saltKey = bcrypt.genSaltSync(10)
//     const hashed_pass = bcrypt.hashSync(code, saltKey)

//     axios({
//       method: 'post',
//       url: powerSupportSMSLink, //TODO
//       data: {
//         header: {
//           accessKey: smsAccessKey,
//         },
//         body: {
//           receiverPhone: Account.phoneNumber,
//           body: code,
//         },
//       },
//     })

//     await AccountModel.update(
//       {
//         password: hashed_pass,
//       },
//       {
//         where: {
//           phone: Account.phoneNumber,
//         },
//       }
//     )
//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const get_profile = async (req, res) => {
//   //TODO
//   try {
//     const { Account } = req.body

//     const { id } = Account

//     const account = await AccountModel.findOne({
//       where: {
//         id: parseInt(id),
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'User not found',
//       })
//     }
//     const password = account.password
//     let profile = account
//     delete profile.dataValues.password
//     delete profile.dataValues.type
//     console.log(profile)
//     console.log(profile.dataValues.password, 'password')
//     return res.json({
//       statusCode: errorCodes.success,
//       profile: account,
//       hasPassword: password !== null,
//     })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const get_profile_number = async (req, res) => {
//   //TODO
//   try {
//     const { phone } = req.body

//     const account = await AccountModel.findOne({
//       where: {
//         phone: phone,
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'User not found',
//       })
//     }
//     const password = account.password
//     let profile = account
//     delete profile.dataValues.password
//     delete profile.dataValues.type
//     console.log(profile)
//     console.log(profile.dataValues.password, 'password')
//     return res.json({
//       statusCode: errorCodes.success,
//       profile: account,
//       hasPassword: password !== null,
//     })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const suspend_account = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const account = await AccountModel.findOne({
//       where: {
//         id: parseInt(Account.id),
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.entityNotFound,
//         error: 'User not found',
//       })
//     }
//     if (account.type === userTypes.ADMIN) {
//       return res.json({
//         statusCode: errorCodes.unauthorized,
//         error: 'Cannot suspend an admin',
//       })
//     }

//     if (account.status === accountStatus.SUSPENDED) {
//       return res.json({
//         statusCode: errorCodes.alreadySuspended,
//         error: 'User already suspended',
//       })
//     }
//     await AccountModel.update(
//       { status: accountStatus.SUSPENDED },
//       { where: { id: Account.id } }
//     )
//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const unsuspend_account = async (req, res) => {
//   try {
//     const { Account } = req.body

//     const account = await AccountModel.findOne({
//       where: {
//         id: parseInt(Account.id),
//       },
//     })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.invalidCredentials,
//         error: 'Wrong credentials',
//       })
//     }
//     if (account.type === userTypes.ADMIN) {
//       return res.json({
//         statusCode: errorCodes.unauthorized,
//         error: 'Cannot suspend an admin account',
//       })
//     }
//     if (account.status === accountStatus.ACTIVE) {
//       return res.json({
//         statusCode: errorCodes.alreadySuspended,
//         error: 'User already active',
//       })
//     }
//     await AccountModel.update(
//       { status: accountStatus.VERIFIED },
//       { where: { id: Account.id } }
//     )
//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

// const make_user_verified = async (req, res) => {
//   try {
//     const { Account } = req.body
//     const { id } = Account
//     const account = await AccountModel.findOne({ where: { id } })
//     if (!account) {
//       return res.json({
//         statusCode: errorCodes.entityNotFound,
//         error: 'User not found',
//       })
//     }
//     if (account.status === accountStatus.VERIFIED) {
//       return res.json({
//         statusCode: errorCodes.alreadyVerified,
//         error: 'User already verified',
//       })
//     }
//     await AccountModel.update(
//       {
//         status: accountStatus.VERIFIED,
//       },
//       {
//         where: {
//           id,
//         },
//       }
//     )
//     return res.json({ statusCode: errorCodes.success })
//   } catch (exception) {
//     return res.json({
//       statusCode: errorCodes.unknown,
//       error: 'Something went wrong',
//     })
//   }
// }

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

module.exports = {
  register,
  // login,
  // verify,
  // change_password,
  // change_email,
  // change_phone,
  // forget_password,
  // confirm_verify,
  // update_profile,
  // get_profile,
  // suspend_account,
  // unsuspend_account,
  // verify_confirm_email,
  // verify_email,
  // register_google,
  // login_google,
  // make_user_verified,
  // register_facebook,
  // login_facebook,
  // unlink_facebook,
  // unlink_google,
  // signUpWithLirtenHub,
  // callBackLirtenHub,
  // resend_token,
  // link_google_facebook,
  // generateUsername,
  // login_admin,
  // get_profile_number,
}
