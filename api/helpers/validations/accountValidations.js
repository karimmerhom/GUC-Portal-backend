const Joi = require('joi')
const { min } = require('moment')
const PasswordComplexity = require('joi-password-complexity')

const {
  accountStatus,
  userTypes,
  memberType,
  days,
} = require('../../constants/GUC.enum')

const validateCreateAccount = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(3).required(),
      phoneNumber: Joi.string().min(11).max(11).required(),
      type: Joi.string()
        .valid(userTypes.HR, userTypes.ACADEMICMEMBER)
        .required(),
      memberType: Joi.string().when('type', {
        is: Joi.string().valid([userTypes.ACADEMICMEMBER]),
        then: Joi.string()
          .valid(
            memberType.MEMBER,
            memberType.HOD,
            memberType.INSTRUCTOR,
            memberType.COORDINATOR
          )
          .required(),
      }),
      daysOff: Joi.string()
        .when('type', {
          is: Joi.string().valid([userTypes.ACADEMICMEMBER]),
          then: Joi.string()
            .valid(
              days.SATURDAY,
              days.SUNDAY,
              days.MONDAY,
              days.TUESDAY,
              days.WEDNESDAY,
              days.THURSDAY
            )
            .required(),
        })
        .when('type', {
          is: Joi.string().valid([userTypes.HR]),
          then: Joi.string().valid(days.SATURDAY).required(),
        }),

      email: Joi.string().email().required(),
      gender: Joi.string().valid('male', 'female').required(),
      salary: Joi.number().required(),
      office: Joi.string().required(),
      department: Joi.string().required(),
    }),
  })
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 1001,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateUpdateProfile = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      firstName: Joi.string().min(3),
      lastName: Joi.string().min(3),
      phoneNumber: Joi.string().min(11).max(11),
      type: Joi.string().valid(userTypes.HR, userTypes.ACADEMICMEMBER),
      memberType: Joi.string().when('type', {
        is: Joi.string().valid([userTypes.ACADEMICMEMBER]),
        then: Joi.string().valid(
          memberType.MEMBER,
          memberType.HOD,
          memberType.INSTRUCTOR,
          memberType.COORDINATOR
        ),
      }),
      daysOff: Joi.string()
        .when('type', {
          is: Joi.string().valid([userTypes.ACADEMICMEMBER]),
          then: Joi.string().valid(
            days.SATURDAY,
            days.SUNDAY,
            days.MONDAY,
            days.TUESDAY,
            days.WEDNESDAY,
            days.THURSDAY
          ),
        })
        .when('type', {
          is: Joi.string().valid([userTypes.HR]),
          then: Joi.string().valid(days.SATURDAY),
        }),

      email: Joi.string().email(),
      gender: Joi.string().valid('male', 'female'),
      salary: Joi.number(),
      office: Joi.string(),
      department: Joi.string(),
    }),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 1001,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  })
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 1001,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateFirstLogin = (req, res, next) => {
  const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 8,
  }

  const schema = Joi.object({
    Account: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    newPassword: new PasswordComplexity(complexityOptions).required(),
  })
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 1001,
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

  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),
    Credentials: Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: new PasswordComplexity(complexityOptions).required(),
    }).required(),
  })
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 1001,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

module.exports = {
  validateChangePassword,
  validateCreateAccount,
  validateLogin,
  validateFirstLogin,
  validateUpdateProfile,
}
