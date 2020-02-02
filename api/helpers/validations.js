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
  const schema = {
    Account: joi
      .object({
        password: new PasswordComplexity(complexityOptions).required(),
        username: joi.string().required(),
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phoneNumber: joi.number().required(),
        email: joi
          .string()
          .email()
          .required(),
        age: joi.number(),
        gender: joi.string().valid(['male', 'female']),
        verifyBy: joi
          .string()
          .valid(['sms', 'email'])
          .required()
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
        username: joi.string().required(),
        code: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

module.exports = { validateAccount, validateLogin, validateVerify }
