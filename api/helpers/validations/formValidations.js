const Joi = require('Joi')
const {
  englishLevel,
  previousOrganizingExperience,
  AvailableAudience,
} = require('../../constants/TBH.enum')

const validateCreateForm = (req, res, next) => {
  const schema = {
    form: Joi.object({
      degree: Joi.string().required(),
      university: Joi.string().required(),
      yearOfGraduation: Joi.string().regex(
        /^(0[1-9]|[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|[1-9]|1[012])[- /.](19|20)\d\d$/
      ),
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
          previousOrganizingExperience.PROF
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
}
const validateViewForm = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }),
    Form: Joi.object({
      id: Joi.number().required(),
    }),
  }
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: '1',
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

module.exports = {
  validateCreateForm,
  validateViewForm,
}
