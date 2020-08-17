const Joi = require('joi')
const errorCodes = require('../../constants/errorCodes')
const { category, State } = require('../../constants/TBH.enum')
const validateCreate = (req, res, next) => {
  const schema = {
    Course: Joi.object({
      title: Joi.string().required(),
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
      attachedMedia: Joi.string().required(),
      durationInHours: Joi.number().required(),
      daysPerWeek: Joi.number().required(),
      sessionDuration: Joi.number().required(),
      pricePerPerson: Joi.number().required(),
      maxNumberOfAttendees: Joi.number().required(),
      minNumberOfAttendees: Joi.number().required(),
      State: Joi.string(),
    }),
    Account: Joi.object({
      id: Joi.number().required(),
    }),
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
const validateViewCourse = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }),
    Course: Joi.object({
      id: Joi.number().required(),
    }),
    accountId: Joi.number().required(),
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
    }),
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

const validateViewAllCoursesAdmin = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }),
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

const validateEditCourse = (req, res, next) => {
  const schema = {
    Course: Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      category: Joi.string(),
      attachedMedia: Joi.string(),
      durationInHours: Joi.number(),
      daysPerWeek: Joi.number(),
      sessionDuration: Joi.number(),
      pricePerPerson: Joi.number(),
      maxNumberOfAttendees: Joi.number(),
      minNumberOfAttendees: Joi.number(),
      id: Joi.number(),
    }),
    Account: Joi.object({
      id: Joi.number(),
    }),
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

const validateDeleteCourse = (req, res, next) => {
  const schema = {
    Course: Joi.object({ id: Joi.number() }),

    Account: Joi.object({
      id: Joi.number(),
    }),
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
const validateStateChange = (req, res, next) => {
  const schema = {
    Course: Joi.object({
      id: Joi.number(),
      State: Joi.string().valid(State.APPROVED).required(),
    }),

    Account: Joi.object({
      id: Joi.number(),
    }),
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
  validateEditCourse,
  validateDeleteCourse,
  validateViewAllCoursesAdmin,
  validateStateChange,
}
