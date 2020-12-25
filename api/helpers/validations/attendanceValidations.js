const Joi = require('joi')

const validateSignInOut = (req, res, next) => {
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
const validateManualSignInOut = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    Attendance: Joi.object({
      academicId: Joi.string().required(),

      hour: Joi.string()
        .regex(/^2[0-3]|[0-1]?[0-9]$/)
        .min(1)
        .max(2)
        .required(),
      minute: Joi.string()
        .regex(/^[1-5]?[0-9]$/)
        .min(1)
        .max(2)
        .required(),
      day: Joi.string()
        .regex(/^(3[01]|[12][0-9]|[1-9])$/)
        .min(1)
        .max(2)
        .required(),
      month: Joi.string()
        .regex(/^[2-9]|1[0-2]?$/)
        .min(1)
        .max(2)
        .required(),
      year: Joi.string().min(4).required(),
    }).required(),
  })
  if (parseInt(req.body.Attendance.year)) {
    if (parseInt(req.body.Attendance.year) >= 1970) {
    } else {
      return res.json({
        statusCode: 1001,
        error: 'Year should be greater than or equal 1970',
      })
    }
  }

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 1001,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateViewMissingDays = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    Attendance: Joi.object({
      academicId: Joi.string().required(),

      month: Joi.string(),
      year: Joi.string(),
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

const validateViewStaffAttendanceRecord = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    Attendance: Joi.object({
      academicId: Joi.string().required(),
      month: Joi.string(),
      year: Joi.string(),
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
const validateViewWithMissingDaysHours = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    Attendance: Joi.object({
      month: Joi.string(),
      year: Joi.string(),
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
const validateViewAllStaffAttendanceRecord = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    Attendance: Joi.object({
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
const validateViewAllMyAttendanceRecord = (req, res, next) => {
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

module.exports = {
  validateViewAllMyAttendanceRecord,
  validateViewAllStaffAttendanceRecord,
  validateViewWithMissingDaysHours,
  validateSignInOut,
  validateViewMissingDays,
  validateManualSignInOut,
  validateViewStaffAttendanceRecord,
}
