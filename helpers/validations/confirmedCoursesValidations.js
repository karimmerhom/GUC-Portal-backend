const Joi = require('joi')
const errorCodes = require('../../constants/errorCodes')
const { category, courseStatus } = require('../../constants/TBH.enum')
const validateCreate = (req, res, next) => {
  const schema = {
    Course: Joi.object({
      title: Joi.string().required(),
      eventTitle: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string()
        .valid(
          category.IT,
          category.Finance,
          category.MARKETING,
          category.Entrepreneurship,
          category.MUSIC,
          category.PDevelopment,
          category.Photography,
          category.Productivity,
          category.ARTS,
          category.WRITING,
          category.DATA,
          category.STATEGY
        )
        .required(),
        status: Joi.string()
        .valid(
          courseStatus.AVAILABLE,
          courseStatus.FULL
        )
        .required(),
      attachedMediaIn: Joi.string().required(),
      attachedMediaOut: Joi.string().required(),
      durationInHours: Joi.number().required(),
      daysPerWeek: Joi.number().required(),
      sessionDuration: Joi.number().required(),
      numberOfSessions: Joi.number().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      price: Joi.number().required(),
      maxNumberOfAttendees: Joi.number().required(),
      minNumberOfAttendees: Joi.number().required(),
      teacherName: Joi.string().required(),
      location: Joi.string().required(),
    }).required(),
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    accountId: Joi.number().required(),
  }
  const isValid = Joi.validate(req.body, schema)
  console.log(isValid)
  if (isValid.error) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: isValid.error.details[0].message,
    })
  }

  return next()
}
const validateViewCourse = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    Course: Joi.object({
      id: Joi.number().required(),
    }).required(),
  }
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: isValid.error.details[0].message,
    })
  }

  return next()
}

const validateViewAllCourses = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
  }
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: isValid.error.details[0].message,
    })
  }

  return next()
}

module.exports = {
  validateCreate,
  validateViewCourse,
  validateViewAllCourses,
}
