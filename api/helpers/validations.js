const joi = require('joi')
const PasswordComplexity = require('joi-password-complexity')

const validateAccount = request => {
  const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 8
  }
  const usernamePattern = /^[a-zA-Z0-9!#_$%&*]{3,25}$/
  const schema = {
    Account: joi
      .object({
        password: new PasswordComplexity(complexityOptions).required(),
        username: joi
          .string()
          .regex(usernamePattern)
          .required(),
        firstName: joi
          .string()
          .min(3)
          .required(),
        lastName: joi
          .string()
          .min(3)
          .required(),
        phoneNumber: joi
          .string()
          .trim()
          .regex(/^[0-9]{11,11}$/)
          .required(),
        email: joi
          .string()
          .email()
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateUpdateProfile = request => {
  const schema = {
    Account: joi
      .object({
        firstName: joi.string().min(3),
        lastName: joi.string().min(3),
        phoneNumber: joi
          .string()
          .trim()
          .regex(/^[0-9]{11,11}$/),
        email: joi.string().email(),
        id: joi.number().required(),
        gender: joi.string().valid('Male', 'Female'),
        birthdate: joi.date(),
        profession: joi.string()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateGetProfile = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateLogin = request => {
  const schema = {
    Account: joi
      .object({
        username: joi.string().required(),
        password: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateVerify = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        verifyBy: joi
          .string()
          .valid(['sms'])
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateConfirmVerify = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        code: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateChangePassword = request => {
  const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 8
  }
  const schema = {
    Account: joi.object({ id: joi.number().required() }).required(),
    Credentials: joi
      .object({
        password: joi.string().required(),
        newPassword: new PasswordComplexity(complexityOptions).required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateChangeEmail = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        email: joi
          .string()
          .email()
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateChangePhone = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        phoneNumber: joi
          .string()
          .trim()
          .regex(/^[0-9]{11,11}$/)
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateForgetPassword = request => {
  const schema = {
    Account: joi
      .object({
        phoneNumber: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateResetPassword = request => {
  const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 8
  }
  const schema = {
    Account: joi
      .object({
        username: joi.string().required(),
        password: new PasswordComplexity(complexityOptions).required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateResendPassword = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        verifyBy: joi
          .string()
          .valid(['sms', 'email'])
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}
const validateSuspendAccount = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateAccount,
  validateLogin,
  validateVerify,
  validateChangePassword,
  validateChangeEmail,
  validateChangePhone,
  validateForgetPassword,
  validateResetPassword,
  validateResendPassword,
  validateConfirmVerify,
  validateUpdateProfile,
  validateGetProfile,
  validateSuspendAccount
}
