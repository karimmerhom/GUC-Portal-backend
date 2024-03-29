const Joi = require('joi')
const {
  englishLevel,
  previousOrganizingExperience,
  AvailableAudience,
} = require('../../constants/TBH.enum')
const errorCodes = require('../../constants/errorCodes')

const validateCreateForm = (req, res, next) => {
  const schema = {
    form: Joi.object({
      degree: Joi.string().required(),
      university: Joi.string().required(),
      yearOfGraduation: Joi.number().required(),
      CV: Joi.string().required(),
      englishLevel: Joi.string()
        .valid(
          englishLevel.BEGINNER,
          englishLevel.FAIR,
          englishLevel.FLUENT,
          englishLevel.GOOD,
          englishLevel.NONE,
          englishLevel.NATIVE
        )
        .required(),
      previousOrganizingExperience: Joi.string()
        .valid(
          previousOrganizingExperience.INFORMAL,
          previousOrganizingExperience.ONLINE,
          previousOrganizingExperience.OTHER,
          previousOrganizingExperience.PROF,
          englishLevel.NONE
        )
        .required(),
      placesOrganizedAtPreviously: Joi.string().required(),
      AvailableAudience: Joi.string()
        .valid(
          AvailableAudience.NOTNOW,
          AvailableAudience.LARGEGROUP,
          AvailableAudience.SMALLGROUP
        )
        .required(),
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
const validateViewForm = (req, res, next) => {
  const schema = {
    Account: Joi.object({
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
const validateEditForm = (req, res, next) => {
  const schema = {
    form: Joi.object({
      degree: Joi.string(),
      university: Joi.string(),
      yearOfGraduation: Joi.number(),
      CV: Joi.string(),
      englishLevel: Joi.string().valid(
        englishLevel.BEGINNER,
        englishLevel.FAIR,
        englishLevel.FLUENT,
        englishLevel.GOOD,
        englishLevel.NONE,
        englishLevel.NATIVE
      ),
      previousOrganizingExperience: Joi.string().valid(
        previousOrganizingExperience.INFORMAL,
        previousOrganizingExperience.ONLINE,
        previousOrganizingExperience.OTHER,
        previousOrganizingExperience.PROF,
        englishLevel.NONE
      ),
      id: Joi.number().required(),
      placesOrganizedAtPreviously: Joi.string(),
      AvailableAudience: Joi.string().valid(
        AvailableAudience.NOTNOW,
        AvailableAudience.LARGEGROUP,
        AvailableAudience.SMALLGROUP
      ),
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

const validateViewAllFormsAdmin = (req, res, next) => {
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
module.exports = {
  validateCreateForm,
  validateEditForm,
  validateViewForm,
  validateViewAllFormsAdmin,
}
