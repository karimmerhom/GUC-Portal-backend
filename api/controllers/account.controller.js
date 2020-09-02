const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const VerificationCode = require('../../models/verificationCodes')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const {
  secretOrKey,
  smsAccessKey,
  emailAccessKey,
} = require('../../config/keys')
const {
  accountStatus,
  verificationMethods,
  userTypes,
} = require('../constants/TBH.enum')
const { generateOTP } = require('../helpers/helpers')

const register = async (req, res) => {
  try {
    const { Account } = req.body
    const findEmail = await AccountModel.findOne({
      where: { email: Account.email.toString().toLowerCase() },
    })
    if (findEmail) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Email already exists',
      })
    }
    const findUsername = await AccountModel.findOne({
      where: { username: Account.username.toString().toLowerCase() },
    })
    if (findUsername) {
      return res.json({
        statusCode: errorCodes.usernameExists,
        error: 'Username already exists',
      })
    }
    const findPhone = await AccountModel.findOne({
      where: { phone: Account.phoneNumber },
    })
    if (findPhone) {
      return res.json({
        statusCode: errorCodes.phoneExists,
        error: 'Phone number already exists',
      })
    }
    const emailCode = await generateOTP()
    const smsCode = await generateOTP()

    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Account.password, saltKey)
    const accountCreated = await AccountModel.create({
      username: Account.username.toString().toLowerCase(),
      password: hashed_pass,
      firstName: Account.firstName,
      lastName: Account.lastName,
      phone: Account.phoneNumber,
      email: Account.email.toString().toLowerCase(),
      status: accountStatus.PENDING,
      type: userTypes.USER,
    })

    await VerificationCode.create({
      emailCode,
      smsCode,
      emailDate: new Date(),
      smsDate: new Date(),
      accountId: accountCreated.id,
    })

    let link =
      'http://localhost:3000?code=' + emailCode + '&id=' + accountCreated.id //TODO
    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/email/email/_send_email', //TODO
      data: {
        header: {
          accessKey: emailAccessKey,
        },
        body: {
          receiverMail: accountCreated.email,
          body: link,
          subject: 'Verify your email',
        },
      },
    })

    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/epush/sms/_send_sms', //TODO
      data: {
        header: {
          accessKey: smsAccessKey,
        },
        body: {
          receiverPhone: accountCreated.phone,
          body: `Your TBH confirmation code is\n ${smsCode}`,
        },
      },
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

const update_profile = async (req, res) => {
  try {
    const { Account } = req.body

    const { id } = req.data
    if (parseInt(id) !== parseInt(Account.id)) {
      return res.json({
        statusCode: errorCodes.authentication,
        error: 'breach',
      })
    }
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(id),
      },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'User not found',
      })
    }
    if (account.status === accountStatus.PENDING) {
      return res.json({
        statusCode: errorCodes.unVerified,
        error: 'Account must be verified',
      })
    }
    if (Account.hasOwnProperty('username')) {
      const checkUsername = await AccountModel.findOne({
        where: {
          username: Account.username,
        },
      })
      if (checkUsername && checkUsername.id !== Account.id) {
        return res.json({
          statusCode: errorCodes.usernameExists,
          message: 'username already exists',
        })
      }
    }
    delete Account.id
    AccountModel.update(Account, { where: { id } })
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const verify = async (req, res) => {
  try {
    const { Account } = req.body

    const account = await AccountModel.findOne({
      where: {
        id: parseInt(Account.id),
      },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.entityNotFound,
        error: 'User not found',
      })
    }
    if (account.status === accountStatus.VERIFIED) {
      return res.json({
        statusCode: errorCodes.alreadyVerified,
        error: 'Already verified',
      })
    }
    const code = await generateOTP()
    await VerificationCode.update(
      {
        smsCode: code,
        smsDate: new Date(),
      },
      { where: { accountId: Account.id } }
    )

    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/epush/sms/_send_sms', //TODO
      data: {
        header: {
          accessKey: smsAccessKey,
        },
        body: {
          receiverPhone: account.phone,
          body: `Your TBH confirmation code is\n ${code}`,
        },
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err.response.data.body.err))

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const verify_email = async (req, res) => {
  try {
    const { Account } = req.body

    const account = await AccountModel.findOne({ where: { id: Account.id } })
    if (!account) {
      return res.json({
        statusCode: errorCodes.entityNotFound,
        error: 'User not found',
      })
    }
    if (account.emailVerified) {
      return res.json({
        statusCode: errorCodes.alreadyVerified,
        error: 'Email already verified',
      })
    }
    const code = await generateOTP()
    await VerificationCode.update(
      {
        emailCode: code,
        emailDate: new Date(),
      },
      { where: { accountId: Account.id } }
    )
    const link = 'http://localhost:3000?code=' + code + '&id=' + account.id
    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/email/email/_send_email', //TODO
      data: {
        header: {
          accessKey: emailAccessKey,
        },
        body: {
          receiverMail: account.email,
          body: link,
          subject: 'Verify your email',
        },
      },
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
const verify_confirm_email = async (req, res) => {
  try {
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { id: Account.id },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.entityNotFound,
        error: 'Account not found',
      })
    }
    const checkCodeExpired = await VerificationCode.findOne({
      where: { accountId: Account.id, emailCode: Account.code },
    })
    if (!checkCodeExpired) {
      return res.json({
        statusCode: errorCodes.wrongVerificationCode,
        error: 'Wrong verification code',
      })
    }
    const date1 = new Date(checkCodeExpired.emailDate)
    const date2 = new Date()
    console.log(date1)
    const diffTime = Math.abs(date2 - date1)
    if (diffTime > 86400000) {
      return res.json({
        statusCode: errorCodes.verificationCodeExpired,
        error: 'This is code has expired',
      })
    }
    if (account.emailVerified) {
      return res.json({
        statusCode: errorCodes.alreadyVerified,
        error: 'Already verified',
      })
    }
    await AccountModel.update(
      { emailVerified: true },
      { where: { id: Account.id } }
    )

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
      where: {
        [Op.or]: {
          username: Account.username.toString().toLowerCase(),
          email: Account.username.toString().toLowerCase(),
          phone: Account.username,
        },
      },
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'Wrong Credentials',
      })
    }

    if (account.status === accountStatus.SUSPENDED) {
      return res.json({
        statusCode: errorCodes.alreadySuspended,
        error: 'Account suspended',
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

    const payLoad = {
      id: account.id,
      firstName: account.firstName,
      lastName: account.lastName,
      username: account.username,
      phone: account.phone,
      email: account.email,
      status: account.status,
      type: account.type,
      emailVerified: account.emailVerified,
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '8h',
    })

    return res.json({
      statusCode: errorCodes.success,
      token,
      id: account.id,
      username: account.username,
      state: account.status,
      emailVerified: account.emailVerified,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const register_google = async (req, res) => {
  try {
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { googleId: Account.id },
    })
    if (account) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Account already exists',
      })
    }
    const findEmail = await AccountModel.findOne({
      where: { email: Account.email.toString().toLowerCase() },
    })
    if (findEmail) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Email already exists',
      })
    }
    const findUsername = await AccountModel.findOne({
      where: { username: Account.username.toString().toLowerCase() },
    })
    if (findUsername) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Username already exists',
      })
    }
    const findPhone = await AccountModel.findOne({
      where: { phone: Account.phoneNumber },
    })
    if (findPhone) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Phone number already exists',
      })
    }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date(),
    })
    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Account.password, saltKey)
    const accountCreated = await AccountModel.create({
      username: Account.username.toString().toLowerCase(),
      firstName: Account.firstName,
      lastName: Account.lastName,
      phone: Account.phoneNumber,
      password: hashed_pass,
      email: Account.email.toString().toLowerCase(),
      status: accountStatus.PENDING,
      type: userTypes.USER,
      verificationCode: code,
      googleId: Account.id,
    })

    const link =
      'http://localhost:3000?code=' + code + '&id=' + accountCreated.id
    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/email/email/_send_email', //TODO
      data: {
        header: {
          accessKey: emailAccessKey,
        },
        body: {
          receiverMail: accountCreated.email,
          body: link,
          subject: 'Verify your email',
        },
      },
    })
    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/epush/sms/_send_sms', //TODO
      data: {
        header: {
          accessKey: smsAccessKey,
        },
        body: {
          receiverPhone: accountCreated.phone,
          body: accountCreated.verificationCode,
        },
      },
    })
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const login_google = async (req, res) => {
  try {
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { googleId: Account.id },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'User not found',
      })
    }
    const payLoad = {
      id: account.id,
      firstName: account.firstName,
      lastName: account.lastName,
      username: account.username,
      phone: account.phone,
      email: account.email,
      status: account.status,
      type: account.type,
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '999999h',
    })

    return res.json({
      statusCode: errorCodes.success,
      token,
      id: account.id,
      username: account.username,
      state: account.status,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const register_facebook = async (req, res) => {
  try {
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { facebookId: Account.id },
    })
    if (account) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Account already exists',
      })
    }
    const findEmail = await AccountModel.findOne({
      where: { email: Account.email.toString().toLowerCase() },
    })
    if (findEmail) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Email already exists',
      })
    }
    const findUsername = await AccountModel.findOne({
      where: { username: Account.username.toString().toLowerCase() },
    })
    if (findUsername) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Username already exists',
      })
    }
    const findPhone = await AccountModel.findOne({
      where: { phone: Account.phoneNumber },
    })
    if (findPhone) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Phone number already exists',
      })
    }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date(),
    })
    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Account.password, saltKey)
    const accountCreated = await AccountModel.create({
      username: Account.username.toString().toLowerCase(),
      password: hashed_pass,
      firstName: Account.firstName,
      lastName: Account.lastName,
      phone: Account.phoneNumber,
      email: Account.email.toString().toLowerCase(),
      status: accountStatus.PENDING,
      type: userTypes.USER,
      verificationCode: code,
      facebookId: Account.id,
    })

    const link =
      'http://localhost:3000?code=' + code + '&id=' + accountCreated.id
    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/email/email/_send_email',
      data: {
        header: {
          accessKey: emailAccessKey,
        },
        body: {
          receiverMail: accountCreated.email,
          body: link,
          subject: 'Verify your email',
        },
      },
    })
    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/epush/sms/_send_sms',
      data: {
        header: {
          accessKey: smsAccessKey,
        },
        body: {
          receiverPhone: accountCreated.phone,
          body: accountCreated.verificationCode,
        },
      },
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

const login_facebook = async (req, res) => {
  try {
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { facebookId: Account.id },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'User not found',
      })
    }
    const payLoad = {
      id: account.id,
      firstName: account.firstName,
      lastName: account.lastName,
      username: account.username,
      phone: account.phone,
      email: account.email,
      status: account.status,
      type: account.type,
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '999999h',
    })

    return res.json({
      statusCode: errorCodes.success,
      token,
      id: account.id,
      username: account.username,
      state: account.status,
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const unlink_facebook = async (req, res) => {
  try {
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { id: parseInt(Account.id) },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'User not found',
      })
    }
    AccountModel.update(
      { facebookId: null },
      {
        where: {
          id: Account.id,
        },
      }
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

const unlink_google = async (req, res) => {
  try {
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { id: parseInt(Account.id) },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'User not found',
      })
    }
    AccountModel.update(
      { googleId: null },
      {
        where: {
          id: Account.id,
        },
      }
    )

    return res.json({
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const confirm_verify = async (req, res) => {
  try {
    const { Account } = req.body

    const account = await AccountModel.findOne({
      where: {
        id: Account.id,
      },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'User not found',
      })
    }
    if (account.status === accountStatus.VERIFIED) {
      return res.json({
        statusCode: errorCodes.alreadyVerified,
        error: 'Already verified',
      })
    }
    const checkCodeExpired = await VerificationCode.findOne({
      where: { accountId: Account.id, smsCode: Account.code },
    })
    if (!checkCodeExpired) {
      return res.json({
        statusCode: errorCodes.wrongVerificationCode,
        error: 'Wrong verification code',
      })
    }
    const date1 = new Date(checkCodeExpired.smsDate)
    const date2 = new Date()
    console.log(date1)
    const diffTime = Math.abs(date2 - date1)
    if (diffTime > 86400000) {
      return res.json({
        statusCode: errorCodes.verificationCodeExpired,
        error: 'This is code has expired',
      })
    }
    if (account.status === accountStatus.VERIFIED) {
      return res.json({
        statusCode: errorCodes.alreadyVerified,
        error: 'Already verified',
      })
    }

    await AccountModel.update(
      {
        status: accountStatus.VERIFIED,
      },
      {
        where: {
          id: Account.id,
        },
      }
    )
    return res.json({
      statusCode: errorCodes.success,
      state: accountStatus.VERIFIED,
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const change_password = async (req, res) => {
  try {
    const { Credentials, Account } = req.body

    const { id } = Account
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(id, 10),
      },
    })

    const match = bcrypt.compareSync(Credentials.password, account.password)
    if (!match) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'Old password is wrong',
      })
    }
    if (Credentials.newPassword === Credentials.password) {
      return res.json({
        statusCode: errorCodes.SamePassword,
        error: 'New password cannot be like old password',
      })
    }
    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Credentials.newPassword, saltKey)
    await AccountModel.update(
      {
        password: hashed_pass,
      },
      {
        where: {
          id: parseInt(id),
        },
      }
    )
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const change_email = async (req, res) => {
  try {
    const { Account } = req.body

    const { id } = Account
    const found = await AccountModel.findOne({
      where: { email: Account.email },
    })
    if (found) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Email Already exists',
      })
    }
    await AccountModel.update(
      {
        email: Account.email,
        emailVerified: false,
      },
      {
        where: {
          id: parseInt(id),
        },
      }
    )

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const change_phone = async (req, res) => {
  try {
    const { Account } = req.body

    const { id } = Account
    const found = await AccountModel.findOne({
      where: { phone: Account.phoneNumber },
    })

    if (found) {
      return res.json({
        statusCode: errorCodes.emailExists,
        error: 'Phone Already exists',
      })
    }
    const code = await generateOTP()
    await VerificationCode.update(
      {
        smsCode: code,
        smsDate: new Date(),
      },
      { where: { accountId: Account.id } }
    )
    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/epush/sms/_send_sms', //TODO
      data: {
        header: {
          accessKey: smsAccessKey,
        },
        body: {
          receiverPhone: Account.phoneNumber,
          body: code,
        },
      },
    })
    await AccountModel.update(
      {
        phone: Account.phoneNumber,
        status: accountStatus.PENDING,
      },
      {
        where: {
          id: parseInt(id),
        },
      }
    )

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const forget_password = async (req, res) => {
  try {
    const { Account } = req.body

    const account = await AccountModel.findOne({
      where: {
        phone: Account.phoneNumber,
      },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'Phone not found',
      })
    }

    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date(),
    })

    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(code, saltKey)

    axios({
      method: 'post',
      url: 'https://dev.power-support.lirten.com/epush/sms/_send_sms', //TODO
      data: {
        header: {
          accessKey: smsAccessKey,
        },
        body: {
          receiverPhone: Account.phoneNumber,
          body: code,
        },
      },
    })

    await AccountModel.update(
      {
        password: hashed_pass,
      },
      {
        where: {
          phone: Account.phoneNumber,
        },
      }
    )
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
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
      where: {
        id: parseInt(id),
      },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'User not found',
      })
    }
    let profile = account
    delete profile.dataValues.password
    delete profile.dataValues.facebookId
    delete profile.dataValues.googleId
    delete profile.dataValues.type

    return res.json({
      statusCode: errorCodes.success,
      profile: account,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const suspend_account = async (req, res) => {
  try {
    const { Account } = req.body

    const account = await AccountModel.findOne({
      where: {
        id: parseInt(Account.id),
      },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.entityNotFound,
        error: 'User not found',
      })
    }
    if (account.type === userTypes.ADMIN) {
      return res.json({
        statusCode: errorCodes.unauthorized,
        error: 'Cannot suspend an admin',
      })
    }

    if (account.status === accountStatus.SUSPENDED) {
      return res.json({
        statusCode: errorCodes.alreadySuspended,
        error: 'User already suspended',
      })
    }
    await AccountModel.update(
      { status: accountStatus.SUSPENDED },
      { where: { id: Account.id } }
    )
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const unsuspend_account = async (req, res) => {
  try {
    const { Account } = req.body

    const account = await AccountModel.findOne({
      where: {
        id: parseInt(Account.id),
      },
    })
    if (!account) {
      return res.json({
        statusCode: errorCodes.invalidCredentials,
        error: 'Wrong credentials',
      })
    }
    if (account.type === userTypes.ADMIN) {
      return res.json({
        statusCode: errorCodes.unauthorized,
        error: 'Cannot suspend an admin account',
      })
    }
    if (account.status === accountStatus.ACTIVE) {
      return res.json({
        statusCode: errorCodes.alreadySuspended,
        error: 'User already active',
      })
    }
    await AccountModel.update(
      { status: accountStatus.VERIFIED },
      { where: { id: Account.id } }
    )
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const make_user_verified = async (req, res) => {
  try {
    const { Account } = req.body
    const { id } = Account
    const account = await AccountModel.findOne({ where: { id } })
    if (!account) {
      return res.json({
        statusCode: errorCodes.entityNotFound,
        error: 'User not found',
      })
    }
    if (account.status === accountStatus.VERIFIED) {
      return res.json({
        statusCode: errorCodes.alreadyVerified,
        error: 'User already verified',
      })
    }
    await AccountModel.update(
      {
        status: accountStatus.VERIFIED,
      },
      {
        where: {
          id,
        },
      }
    )
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

module.exports = {
  register,
  login,
  verify,
  change_password,
  change_email,
  change_phone,
  forget_password,
  confirm_verify,
  update_profile,
  get_profile,
  suspend_account,
  unsuspend_account,
  verify_confirm_email,
  verify_email,
  register_google,
  login_google,
  make_user_verified,
  register_facebook,
  login_facebook,
  unlink_facebook,
  unlink_google,
}
