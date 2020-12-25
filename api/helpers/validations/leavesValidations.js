const Joi = require('joi')

const validateRequestLeave = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    leaveDay: Joi.object({
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

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 1001,
      error: isValid.error.details[0].message,
    })
  }
  if (parseInt(req.body.leaveDay.year)) {
    if (parseInt(req.body.leaveDay.year) >= 1970) {
    } else {
      return res.json({
        statusCode: 1001,
        error: 'Year should be greater than or equal 1970',
      })
    }
  }
  return next()
}

const validateacceptLeave = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    leaveId: Joi.string().required(),
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
  validateRequestLeave,
  validateacceptLeave,
}
