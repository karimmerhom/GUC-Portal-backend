const bcrypt = require('bcrypt')
const axios = require('axios')
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const validator = require('../helpers/validations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const { salt, expiration, secretOrKey } = require('../../config/keys')
const { accountStatus, verificationMethods } = require('../constants/TBH.enum')
const VerificationCode = require('../../models/verificationCodes')

const generateOTP = async () => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  const duplicate = await VerificationCode.findOne({ where: { code: text } })
  if (duplicate) {
    return generateOTP()
  }
  return text
}

const register = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateAccount({ Account })
    if (isValid.error) {
      return res.json({ code: errorCodes.validation })
    }
    const findAccount = await AccountModel.findOne({
      where: {
        [Op.or]: [{ email: Account.email }, { username: Account.username }]
      }
    })
    if (findAccount) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Email/username already exists'
      })
    }
    const code = await generateOTP()
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
      }).then(res => {
        console.log(res)
      })
    }
    console.log(Account.verifyBy)

    if (Account.verifyBy === verificationMethods.SMS) {
      console.log('here')
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
      }).then(res => {
        console.log(res)
      })
    }
    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(Account.password, saltKey)
    const account = await AccountModel.create({
      username: Account.username.toString().toLowerCase(),
      password: hashed_pass,
      firstName: Account.firstName,
      lastName: Account.lastName,
      phone: Account.phoneNumber,
      email: Account.email.toString().toLowerCase(),
      age: Account.age,
      gender: Account.gender,
      status: accountStatus.PENDING,
      verificationCode: code
    })
    return res.json({ code: 0 })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown })
  }
}

const login = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateLogin({ Account })
    if (isValid.error) {
      return res.json({ code: errorCodes.validation })
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
        message: 'User not found'
      })
    }

    if (account.status === accountStatus.PENDING) {
      return res.json({ code: errorCodes.unVerified })
    }
    const match = bcrypt.compareSync(Account.password, account.password)
    if (!match) {
      return res.json({ code: errorCodes.invalidCredentials })
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
      expiresIn: 8
    })

    return res.json({ token, id: account.id })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown })
  }
}

const verify = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateVerify({ Account })
    if (isValid.error) {
      return res.json({ code: errorCodes.validation })
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
        message: 'User not found'
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
      return res.json({ code: 0 })
    }
    return res.json({ code: errorCodes.wrongVerificationCode })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown })
  }
}

module.exports = {
  register,
  login,
  verify
}
