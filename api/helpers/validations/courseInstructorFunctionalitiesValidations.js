const Joi = require('joi')

const validateViewMyCoursesCoverage  = (req, res, next) => {
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
const validateViewStaff = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      academicId: Joi.string().required(),
    }).required(),
    courseId: Joi.string(),
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
  validateViewMyCoursesCoverage,
  validateViewStaff
}
