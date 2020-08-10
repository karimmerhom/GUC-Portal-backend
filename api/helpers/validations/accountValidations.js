const joi = require('joi')
const PasswordComplexity = require('joi-password-complexity')
const { validation } = require('../../constants/errorCodes')
const validationFail = validation

const validateAccount = (req, res, next) => {
  const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 8,
  }
  const usernamePattern = /^[a-zA-Z0-9!#_$%&*]{3,25}$/
  const schema = {
    Account: joi
      .object({
        password: new PasswordComplexity(complexityOptions).required(),
        username: joi.string().regex(usernamePattern).required(),
        firstName: joi.string().min(3).required(),
        lastName: joi.string().min(3).required(),
        phoneNumber: joi
          .string()
          .trim()
          .regex(/^[0-9]{11,11}$/)
          .required(),
        email: joi.string().email().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateUpdateProfile = (req, res, next) => {
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
        profession: joi.string(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateGetProfile = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateLogin = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        username: joi.string().required(),
        password: joi.string().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateEmail = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateConfirmVerifyEmail = (req, res, next) => {
  const schema = {
    code: joi.string().required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateVerify = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        verifyBy: joi.string().valid(['sms']).required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateConfirmVerify = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        code: joi.string().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateChangePassword = (req, res, next) => {
  const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 8,
  }
  const schema = {
    Account: joi.object({ id: joi.number().required() }).required(),
    Credentials: joi
      .object({
        password: joi.string().required(),
        newPassword: new PasswordComplexity(complexityOptions).required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateChangeEmail = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        email: joi.string().email().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateChangePhone = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        phoneNumber: joi
          .string()
          .trim()
          .regex(/^[0-9]{11,11}$/)
          .required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateForgetPassword = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        phoneNumber: joi.string().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateResetPassword = (req, res, next) => {
  const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 8,
  }
  const schema = {
    Account: joi
      .object({
        username: joi.string().required(),
        password: new PasswordComplexity(complexityOptions).required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateResendPassword = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
        verifyBy: joi.string().valid(['sms', 'email']).required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}
const validateSuspendAccount = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateAccountGoogle = (req, res, next) => {
  const usernamePattern = /^[a-zA-Z0-9!#_$%&*]{3,25}$/
  const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 8,
  }
  const schema = {
    Account: joi
      .object({
        id: joi.string().required(),
        password: new PasswordComplexity(complexityOptions).required(),
        username: joi.string().regex(usernamePattern).required(),
        firstName: joi.string().min(3).required(),
        lastName: joi.string().min(3).required(),
        phoneNumber: joi
          .string()
          .trim()
          .regex(/^[0-9]{11,11}$/)
          .required(),
        email: joi.string().email().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}
const validateLoginGoogle = (req, res, next) => {
  const schema = {
    Account: joi
      .object({
        id: joi.string().required(),
      })
      .required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}
const validateCallbackGoogle = (req, res, next) => {
  const schema = {
    state: joi.string().valid('signIn', 'signUp').required(),
  }
  const isValid = joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
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
  validateSuspendAccount,
  validateEmail,
  validateAccountGoogle,
  validateLoginGoogle,
  validateCallbackGoogle,
  validateConfirmVerifyEmail,
}
