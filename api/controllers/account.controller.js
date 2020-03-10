const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const validator = require('../helpers/validations/accountValidations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const {
  secretOrKey,
  smsAccessKey,
  contactAccessKey,
  emailAccessKey
} = require('../../config/keys')
const {
  accountStatus,
  verificationMethods,
  userTypes
} = require('../constants/TBH.enum')
const VerificationCode = require('../../models/verificationCodes')
const {
  generateOTP,
  gift_package,
  underAgeValidate
} = require('../helpers/helpers')

const register = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateAccount({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const findEmail = await AccountModel.findOne({
      where: { email: Account.email.toString().toLowerCase() }
    })
    if (findEmail) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Email already exists'
      })
    }
    const findUsername = await AccountModel.findOne({
      where: { username: Account.username.toString().toLowerCase() }
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
      verificationCode: code
    })
    return await axios({
      method: 'post',
      url: 'https://cubexs.net/contacts/createcontact',
      data: {
        header: {
          accessKey: contactAccessKey
        },
        body: {
          firstName: Account.firstName,
          lastName: Account.lastName,
          email: Account.email,
          phoneNumber: Account.phoneNumber,
          ownerId: parseInt(accountCreated.id)
        }
      }
    })
      .then(resp => {
        const link = 'https://cubexs.net/login?code=' + code
        axios({
          method: 'post',
          url: 'https://cubexs.net/emailservice/sendemail',
          data: {
            header: {
              accessKey: emailAccessKey
            },
            body: {
              receiverMail: accountCreated.email,
              body: link,
              subject: 'Verify your email'
            }
          }
        })
        axios({
          method: 'post',
          url: 'https://cubexs.net/epushservice/sendsms',
          data: {
            header: {
              accessKey: smsAccessKey
            },
            body: {
              receiverPhone: accountCreated.phone,
              body: `Your TBH confirmation code is\n ${accountCreated.verificationCode}`
            }
          }
        })
        gift_package(5, 'meeting room', parseInt(accountCreated.id))
        gift_package(5, 'training room', parseInt(accountCreated.id))
        return res.json({ code: errorCodes.success })
      })
      .catch(err => {
        AccountModel.destroy({ where: { id: accountCreated.id } })
        return res.json({
          code: errorCodes.unknown,
          error: 'Something went wrong'
        })
      })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const update_profile = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateUpdateProfile({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
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
    if (account.status === accountStatus.PENDING) {
      return res.json({
        code: errorCodes.unVerified,
        error: 'Account must be verified'
      })
    }
    if (Account.birthdate) {
      const check = new Date(Account.birthdate)
      const helper = underAgeValidate(check)
      if (helper) {
        return res.json({ code: errorCodes.underAge, error: 'Must be over 18' })
      }
    }
    axios({
      method: 'post',
      url: 'https://cubexs.net/contacts/updatecontact',
      data: {
        header: {
          accessKey: contactAccessKey
        },
        body: {
          firstName: Account.firstName,
          lastName: Account.lastName,
          email: Account.email,
          phoneNumber: Account.phoneNumber,
          ownerId: parseInt(Account.id),
          gender: Account.gender,
          birthdate: Account.birthdate,
          profession: Account.profession
        }
      }
    })
    return res.json({ code: errorCodes.success })
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
        error: isValid.error.details[0].message
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
        code: errorCodes.entityNotFound,
        error: 'User not found'
      })
    }
    if (account.status === accountStatus.VERIFIED) {
      return res.json({
        code: errorCodes.alreadyVerified,
        error: 'Already verified'
      })
    }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })
    await AccountModel.update(
      { verificationCode: code },
      { where: { id: Account.id } }
    )
    if (Account.verifyBy === verificationMethods.SMS) {
      axios({
        method: 'post',
        url: 'https://cubexs.net/epushservice/sendsms',
        data: {
          header: {
            accessKey: smsAccessKey
          },
          body: {
            receiverPhone: account.phone,
            body: `Your TBH confirmation code is\n ${code}`
          }
        }
      })
    }
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const verify_email = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateEmail({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const account = await AccountModel.findOne({ where: { id: Account.id } })
    if (account.emailVerified) {
      return res.json({
        code: errorCodes.alreadyVerified,
        code: 'Email already verified'
      })
    }
    const link = 'https://cubexs.net/login?code=' + account.verificationCode
    axios({
      method: 'post',
      url: 'https://cubexs.net/emailservice/sendemail',
      data: {
        header: {
          accessKey: emailAccessKey
        },
        body: {
          receiverMail: account.email,
          body: link,
          subject: 'Verify your email'
        }
      }
    })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}
const verify_confirm_email = async (req, res) => {
  try {
    const { verificationCode } = req.params
    await AccountModel.update(
      { emailVerified: true },
      { where: { verificationCode } }
    )

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
        error: isValid.error.details[0].message
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
        error: 'Wrong Credentials'
      })
    }

    if (account.status === accountStatus.SUSPENDED) {
      return res.json({
        code: errorCodes.alreadySuspended,
        error: 'Account suspended'
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
      email: account.email,
      status: account.status,
      type: account.type,
      emailVerified: account.emailVerified
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '8h'
    })

    return res.json({
      code: errorCodes.success,
      token,
      id: account.id,
      username: account.username,
      state: account.status,
      emailVerified: account.emailVerified
    })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const register_google = async (req, res) => {
  try {
    const isValid = validator.validateAccountGoogle(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { googleId: Account.id }
    })
    if (account) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Account already exists'
      })
    }
    const findEmail = await AccountModel.findOne({
      where: { email: Account.email.toString().toLowerCase() }
    })
    if (findEmail) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Email already exists'
      })
    }
    const findUsername = await AccountModel.findOne({
      where: { username: Account.username.toString().toLowerCase() }
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
    const accountCreated = await AccountModel.create({
      username: Account.username.toString().toLowerCase(),
      firstName: Account.firstName,
      lastName: Account.lastName,
      phone: Account.phoneNumber,
      email: Account.email.toString().toLowerCase(),
      status: accountStatus.PENDING,
      type: userTypes.USER,
      verificationCode: code,
      googleId: Account.id
    })
    return await axios({
      method: 'post',
      url: 'https://cubexs.net/contacts/createcontact',
      data: {
        header: {
          accessKey: contactAccessKey
        },
        body: {
          firstName: Account.firstName,
          lastName: Account.lastName,
          email: Account.email,
          phoneNumber: Account.phoneNumber,
          ownerId: parseInt(accountCreated.id),
          googleId: Account.id
        }
      }
    })
      .then(resp => {
        const link = 'https://cubexs.net/login?code=' + code
        axios({
          method: 'post',
          url: 'https://cubexs.net/emailservice/sendemail',
          data: {
            header: {
              accessKey: emailAccessKey
            },
            body: {
              receiverMail: accountCreated.email,
              body: link,
              subject: 'Verify your email'
            }
          }
        })
        axios({
          method: 'post',
          url: 'https://cubexs.net/epushservice/sendsms',
          data: {
            header: {
              accessKey: smsAccessKey
            },
            body: {
              receiverPhone: accountCreated.phone,
              body: accountCreated.verificationCode
            }
          }
        })
        return res.json({ code: errorCodes.success })
      })
      .catch(err => {
        AccountModel.destroy({ where: { id: accountCreated.id } })
        return res.json({
          code: errorCodes.unknown,
          error: 'Something went wrong'
        })
      })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const login_google = async (req, res) => {
  try {
    const isValid = validator.validateLoginGoogle(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { googleId: Account.id }
    })
    if (!account) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'User not found'
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
      type: account.type
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '999999h'
    })

    return res.json({
      code: errorCodes.success,
      token,
      id: account.id,
      username: account.username,
      state: account.status
    })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const register_facebook = async (req, res) => {
  try {
    const isValid = validator.validateAccountGoogle(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { facebookId: Account.id }
    })
    if (account) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Account already exists'
      })
    }
    const findEmail = await AccountModel.findOne({
      where: { email: Account.email.toString().toLowerCase() }
    })
    if (findEmail) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Email already exists'
      })
    }
    const findUsername = await AccountModel.findOne({
      where: { username: Account.username.toString().toLowerCase() }
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
    const accountCreated = await AccountModel.create({
      username: Account.username.toString().toLowerCase(),
      firstName: Account.firstName,
      lastName: Account.lastName,
      phone: Account.phoneNumber,
      email: Account.email.toString().toLowerCase(),
      status: accountStatus.PENDING,
      type: userTypes.USER,
      verificationCode: code,
      facebookId: Account.id
    })
    return await axios({
      method: 'post',
      url: 'https://cubexs.net/contacts/createcontact',
      data: {
        header: {
          accessKey: contactAccessKey
        },
        body: {
          firstName: Account.firstName,
          lastName: Account.lastName,
          email: Account.email,
          phoneNumber: Account.phoneNumber,
          ownerId: parseInt(accountCreated.id),
          facebookId: Account.id
        }
      }
    })
      .then(resp => {
        const link = 'https://cubexs.net/login?code=' + code
        axios({
          method: 'post',
          url: 'https://cubexs.net/emailservice/sendemail',
          data: {
            header: {
              accessKey: emailAccessKey
            },
            body: {
              receiverMail: accountCreated.email,
              body: link,
              subject: 'Verify your email'
            }
          }
        })
        axios({
          method: 'post',
          url: 'https://cubexs.net/epushservice/sendsms',
          data: {
            header: {
              accessKey: smsAccessKey
            },
            body: {
              receiverPhone: accountCreated.phone,
              body: accountCreated.verificationCode
            }
          }
        })
        return res.json({ code: errorCodes.success })
      })
      .catch(err => {
        AccountModel.destroy({ where: { id: accountCreated.id } })
        console.log(err)
        return res.json({
          code: errorCodes.unknown,
          error: 'Something went wrong'
        })
      })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const login_facebook = async (req, res) => {
  try {
    const isValid = validator.validateLoginGoogle(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account } = req.body
    const account = await AccountModel.findOne({
      where: { facebookId: Account.id }
    })
    if (!account) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'User not found'
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
      type: account.type
    }

    const token = jwt.sign(payLoad, secretOrKey, {
      expiresIn: '999999h'
    })

    return res.json({
      code: errorCodes.success,
      token,
      id: account.id,
      username: account.username,
      state: account.status
    })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const confirm_verify = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateConfirmVerify({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { id } = req.data
    if (parseInt(id, 10) !== parseInt(Account.id, 10)) {
      return res.json({ code: errorCodes.authentication, error: 'breach' })
    }
    const account = await AccountModel.findOne({
      where: {
        id
      }
    })
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    if (account.status === accountStatus.VERIFIED) {
      return res.json({
        code: errorCodes.alreadyVerified,
        error: 'Already verified'
      })
    }
    const checkCodeExpired = await VerificationCode.findOne({
      where: { code: account.verificationCode }
    })
    if (!checkCodeExpired) {
      return res.json({
        code: errorCodes.wrongVerificationCode,
        error: 'Wrong verification code'
      })
    }
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
            id
          }
        }
      )
      return res.json({
        code: errorCodes.success,
        state: accountStatus.VERIFIED
      })
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
    const { Credentials, Account } = req.body
    const isValid = validator.validateChangePassword({ Credentials, Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { id } = Account
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(id, 10)
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
        error: isValid.error.details[0].message
      })
    }
    const { id } = Account
    const found = await AccountModel.findOne({
      where: { email: Account.email }
    })
    if (found) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Email Already exists'
      })
    }
    await AccountModel.update(
      {
        email: Account.email,
        emailVerified: false
      },
      {
        where: {
          id: parseInt(id)
        }
      }
    )
    axios({
      method: 'post',
      url: 'https://cubexs.net/contacts/updatecontact',
      data: {
        header: {
          accessKey: contactAccessKey
        },
        body: {
          email: Account.email,
          ownerId: parseInt(Account.id)
        }
      }
    })
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
        error: isValid.error.details[0].message
      })
    }
    const { id } = Account
    const found = await AccountModel.findOne({
      where: { phone: Account.phoneNumber }
    })

    if (found) {
      return res.json({
        code: errorCodes.emailExists,
        error: 'Phone Already exists'
      })
    }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })
    axios({
      method: 'post',
      url: 'https://cubexs.net/epushservice/sendsms',
      data: {
        header: {
          accessKey: smsAccessKey
        },
        body: {
          receiverPhone: Account.phoneNumber,
          body: code
        }
      }
    })
    await AccountModel.update(
      {
        phone: Account.phoneNumber,
        status: accountStatus.PENDING,
        verificationCode: code
      },
      {
        where: {
          id: parseInt(id)
        }
      }
    )
    axios({
      method: 'post',
      url: 'https://cubexs.net/contacts/updatecontact',
      data: {
        header: {
          accessKey: contactAccessKey
        },
        body: {
          phoneNumber: Account.phoneNumber,
          ownerId: parseInt(Account.id)
        }
      }
    })
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
        error: isValid.error.details[0].message
      })
    }
    const account = await AccountModel.findOne({
      where: {
        phone: Account.phoneNumber
      }
    })
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'Phone not found'
      })
    }

    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })

    const saltKey = bcrypt.genSaltSync(10)
    const hashed_pass = bcrypt.hashSync(code, saltKey)

    axios({
      method: 'post',
      url: 'https://cubexs.net/epushservice/sendsms',
      data: {
        header: {
          accessKey: smsAccessKey
        },
        body: {
          receiverPhone: Account.phoneNumber,
          body: code
        }
      }
    })

    await AccountModel.update(
      {
        password: hashed_pass
      },
      {
        where: {
          phone: Account.phoneNumber
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const get_profile = async (req, res) => {
  try {
    const { Account } = req.body
    const isValid = validator.validateGetProfile({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { id } = Account

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
    let profile
    await axios({
      method: 'post',
      url: 'https://cubexs.net/contacts/getcontact',
      data: {
        header: {
          accessKey: contactAccessKey
        },
        body: {
          ownerId: parseInt(Account.id)
        }
      }
    }).then(res => {
      profile = res.data.body.Item
    })
    return res.json({
      code: errorCodes.success,
      profile,
      state: account.status
    })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const suspend_account = async (req, res) => {
  try {
    const { Account } = req.body

    const isValid = validator.validateSuspendAccount({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(Account.id)
      }
    })
    if (!account) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'User not found'
      })
    }
    if (account.type === userTypes.ADMIN) {
      return res.json({
        code: errorCodes.unauthorized,
        error: 'Cannot suspend an admin'
      })
    }

    if (account.status === accountStatus.SUSPENDED) {
      return res.json({
        code: errorCodes.alreadySuspended,
        error: 'User already suspended'
      })
    }
    await AccountModel.update(
      { status: accountStatus.SUSPENDED },
      { where: { id: Account.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const unsuspend_account = async (req, res) => {
  try {
    const { Account } = req.body

    const isValid = validator.validateSuspendAccount({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(Account.id)
      }
    })
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'Wrong credentials'
      })
    }
    if (account.type === userTypes.ADMIN) {
      return res.json({
        code: errorCodes.unauthorized,
        error: 'Cannot suspend an admin account'
      })
    }
    if (account.status === accountStatus.ACTIVE) {
      return res.json({
        code: errorCodes.alreadySuspended,
        error: 'User already active'
      })
    }
    await AccountModel.update(
      { status: accountStatus.VERIFIED },
      { where: { id: Account.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const get_accounts = async (req, res) => {
  try {
    const allAccounts = await axios({
      method: 'post',
      url: 'https://cubexs.net/contacts/getcontacts',
      data: { header: { accessKey: contactAccessKey } }
    })

    return res.json({ code: errorCodes.success, data: allAccounts.data.body })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const make_user_verified = async (req, res) => {
  try {
    const isValid = validator.validateSuspendAccount({ Account })
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account } = req.body
    const { id } = Account
    const account = await AccountModel.findOne({ where: { id } })
    if (!account) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'User not found'
      })
    }
    if (account.status === accountStatus.VERIFIED) {
      return res.json({
        code: errorCodes.alreadyVerified,
        error: 'User already verified'
      })
    }
    await AccountModel.update(
      {
        status: accountStatus.VERIFIED
      },
      {
        where: {
          id
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
  confirm_verify,
  update_profile,
  get_profile,
  suspend_account,
  unsuspend_account,
  get_accounts,
  verify_confirm_email,
  verify_email,
  register_google,
  login_google,
  make_user_verified,
  register_facebook,
  login_facebook
}
