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
    Account: Joi.object({ academicId: Joi.string().required() }),
    academicIdToUpdate: Joi.string().required(),
    AccountUpdated: Joi.object({
      email: Joi.string().email(),
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
      gender: Joi.string().valid('male', 'female'),
      office: Joi.string(),
      department: Joi.string(),
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
const validateGetProfile = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
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
const validateDeleteProfile = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
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
const validateUpdateSalary = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    salary: Joi.number().required(),
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
const validateCalculateSalary = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    Attendance: Joi.object({
      month: Joi.string()
        .regex(/^[2-9]|1[0-2]?$/)
        .min(1)
        .max(2)
        .required(),
      year: Joi.string().min(4).required(),
    }),
    academicId: Joi.string().required(),
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
const validateCalculateMySalary = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    Attendance: Joi.object({
      month: Joi.string()
        .regex(/^[2-9]|1[0-2]?$/)
        .min(1)
        .max(2)
        .required(),
      year: Joi.string().min(4).required(),
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
module.exports = {
  validateCalculateSalary,
  validateCalculateMySalary,
  validateUpdateSalary,
  validateGetProfile,
  validateChangePassword,
  validateCreateAccount,
  validateLogin,
  validateFirstLogin,
  validateUpdateProfile,
  validateDeleteProfile,
}
