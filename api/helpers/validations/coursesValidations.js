const Joi = require('joi')

const validateCreateCourse = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),
    courseId: Joi.string().required(),
    courseName: Joi.string().required(),
    creditHours: Joi.number().required(),
    department: Joi.string().required(),
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

const validateUpdateCourse = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),
    courseId: Joi.string().required(),
    courseName: Joi.string(),
    creditHours: Joi.number(),
    faculty: Joi.string(),
    department: Joi.string().required(),
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

const validateDeleteCourse = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),
    courseId: Joi.string().required(),
    department: Joi.string().required(),
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

const validateAssign = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),
    courseId: Joi.string().required(),
    assignedAcademicId: Joi.string().required(),
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
  validateCreateCourse,
  validateUpdateCourse,
  validateDeleteCourse,
  validateAssign,
}
