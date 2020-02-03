const bcrypt = require('bcrypt')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const validator = require('../helpers/validations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const { secretOrKey } = require('../../config/keys')
const { accountStatus, verificationMethods } = require('../constants/TBH.enum')
const VerificationCode = require('../../models/verificationCodes')
const { generateOTP } = require('../helpers/helpers')

const register = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateAccount({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const findEmail = await AccountModel.findOne({
      where: { email: Account.email }
    })
    if (findEmail) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Email already exists'
      })
    }
    const findUsername = await AccountModel.findOne({
      where: { username: Account.username }
    })
    if (findUsername) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Username already exists'
      })
    }
    const findPhone = await AccountModel.findOne({
      where: { phone: Account.phoneNumber }
    })
    if (findPhone) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Phone number already exists'
      })
    }

    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })
    if (Account.verifyBy === verificationMethods.EMAIL) {
      axios({
        method: 'post',
        url: 'http://18.185.138.12:2000/emailservice/sendemail',
        data: {
          header: {
            accessKey: '6kohol360nx7cobnnetam3puhmeg0bmx-n1in91m-db647jnzr'
          },
          body: {
            receiverMail: Account.email,
            body: code,
            subject: 'Verify your account'
          }
        }
      })
    }

    if (Account.verifyBy === verificationMethods.SMS) {
      axios({
        method: 'post',
        url: 'http://18.185.138.12:2001/epushservice/sendsms',
        data: {
          header: {
            accessKey: 'inf7qawo9ooyxkxpj92ix5ffqn647zed-z9u4m79-c4oeqsyv3'
          },
          body: {
            receiverPhone: Account.phoneNumber,
            body: code
          }
        }
      })
    }
    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Account.password, saltKey)
    await AccountModel.create({
      username: Account.username.toString().toLowerCase(),
      password: hashed_pass,
      firstName: Account.firstName,
      lastName: Account.lastName,
      phone: Account.phoneNumber,
      email: Account.email.toString().toLowerCase(),
      status: accountStatus.PENDING,
      verificationCode: code
    })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const login = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateLogin({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }

    const account = await AccountModel.findOne({
      where: {
        [Op.or]: {
          username: Account.username.toString().toLowerCase(),
          email: Account.username.toString().toLowerCase(),
          phone: Account.username
        }
      }
    })

    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }

    if (account.password === null) {
      return res.json({
        code: errorCodes.forgotPassword,
        error: 'Please reset your password'
      })
    }

    // if (account.status === accountStatus.PENDING) {
    //   return res.json({ code: errorCodes.unVerified })
    // }
    const match = bcrypt.compareSync(Account.password, account.password)
    if (!match) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'Wrong Credentials'
      })
    }

    const payLoad = {
      id: account.id,
      firstName: account.firstName,
      lastName: account.lastName,
      username: account.username,
      phone: account.phone,
      email: account.email
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '8h'
    })

    return res.json({ code: errorCodes.success, token, id: account.id })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const verify = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateVerify({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const account = await AccountModel.findOne({
      where: {
        [Op.or]: {
          username: Account.username.toString().toLowerCase(),
          email: Account.username.toString().toLowerCase()
        }
      }
    })
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    const checkCodeExpired = await VerificationCode.findOne({
      where: { code: account.verificationCode }
    })
    const date1 = new Date(checkCodeExpired.date)
    const date2 = new Date()
    const diffTime = Math.abs(date2 - date1)
    if (diffTime > 86400000) {
      return res.json({
        code: errorCodes.verificationCodeExpired,
        error: 'This is code has expired'
      })
    }
    if (account.status === accountStatus.VERIFIED) {
      return res.json({
        code: errorCodes.alreadyVerified,
        error: 'Already verified'
      })
    }
    const correctCode = account.verificationCode
    if (Account.code === correctCode) {
      await AccountModel.update(
        {
          status: accountStatus.VERIFIED
        },
        {
          where: {
            [Op.or]: {
              username: Account.username.toString().toLowerCase(),
              email: Account.username.toString().toLowerCase()
            }
          }
        }
      )
      return res.json({ code: errorCodes.success })
    }
    return res.json({
      code: errorCodes.wrongVerificationCode,
      error: 'Wrong verification code'
    })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const change_password = async (req, res) => {
  try {
    const { Credentials } = req.body
    const isValid = validator.validateChangePassword({ Credentials })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const { id } = req.data
    if (parseInt(id) !== parseInt(Credentials.id)) {
      return res.json({ code: errorCodes.authentication, error: 'breach' })
    }
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(id)
      }
    })

    const match = bcrypt.compareSync(Credentials.password, account.password)
    if (!match) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'Old password is wrong'
      })
    }
    if (Credentials.newPassword === Credentials.password) {
      return res.json({
        code: errorCodes.SamePassword,
        error: 'New password cannot be like old password'
      })
    }
    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Credentials.newPassword, saltKey)
    await AccountModel.update(
      {
        password: hashed_pass
      },
      {
        where: {
          id: parseInt(id)
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const change_email = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateChangeEmail({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const { id } = req.data
    if (parseInt(id) !== parseInt(Account.id)) {
      return res.json({ code: errorCodes.authentication, error: 'breach' })
    }
    await AccountModel.update(
      {
        email: Account.email
      },
      {
        where: {
          id: parseInt(id)
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const change_phone = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateChangePhone({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const { id } = req.data
    if (parseInt(id) !== parseInt(Account.id)) {
      return res.json({ code: errorCodes.authentication, error: 'breach' })
    }
    await AccountModel.update(
      {
        phone: Account.phoneNumber
      },
      {
        where: {
          id: parseInt(id)
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const forget_password = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateForgetPassword({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const account = await AccountModel.findOne({
      where: {
        [Op.or]: {
          username: Account.username.toString().toLowerCase(),
          email: Account.username.toString().toLowerCase()
        }
      }
    })

    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    await AccountModel.update(
      {
        password: null
      },
      {
        where: {
          [Op.or]: {
            username: Account.username.toString().toLowerCase(),
            email: Account.username.toString().toLowerCase()
          }
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const reset_password = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateResetPassword({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const account = await AccountModel.findOne({
      where: {
        [Op.or]: {
          username: Account.username.toString().toLowerCase(),
          email: Account.username.toString().toLowerCase()
        }
      }
    })

    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }

    if (account.password !== null) {
      return res.json({
        code: errorCodes.notAccessibleNow,
        error: 'Cannot reset password now'
      })
    }
    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Account.password, saltKey)
    await AccountModel.update(
      {
        password: hashed_pass
      },
      {
        where: {
          [Op.or]: {
            username: Account.username.toString().toLowerCase(),
            email: Account.username.toString().toLowerCase()
          }
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const resend_password = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateResendPassword({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const { id } = req.data
    if (parseInt(id) !== parseInt(Account.id)) {
      return res.json({ code: errorCodes.authentication, error: 'breach' })
    }
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(id)
      }
    })

    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })
    if (Account.verifyBy === verificationMethods.EMAIL) {
      axios({
        method: 'post',
        url: 'http://18.185.138.12:2000/emailservice/sendemail',
        data: {
          header: {
            accessKey: '6kohol360nx7cobnnetam3puhmeg0bmx-n1in91m-db647jnzr'
          },
          body: {
            receiverMail: account.email,
            body: code,
            subject: 'Verify your account'
          }
        }
      })
    }

    if (Account.verifyBy === verificationMethods.SMS) {
      axios({
        method: 'post',
        url: 'http://18.185.138.12:2001/epushservice/sendsms',
        data: {
          header: {
            accessKey: 'inf7qawo9ooyxkxpj92ix5ffqn647zed-z9u4m79-c4oeqsyv3'
          },
          body: {
            receiverPhone: account.phone,
            body: code
          }
        }
      })
    }
    await AccountModel.update(
      {
        verificationCode: code
      },
      {
        where: {
          id: parseInt(id)
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
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
  reset_password,
  resend_password
}
