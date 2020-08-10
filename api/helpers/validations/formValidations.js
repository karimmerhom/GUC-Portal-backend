const joi = require('joi')
const {
  englishLevel,
  previousOrganizingExperience,
  AvailableAudience,
} = require('../../constants/TBH.enum')
const validateCreateForm = (req, res, next) => {
  const schema = {
    degree: joi.string().required(),
    university: joi.string().required(),
    yearOfGraduation: joi.date().required(),
    CV: joi.string().required(),
    englishLevel: joi
      .string()
      .valid(
        englishLevel.BEGINNER,
        englishLevel.FAIR,
        englishLevel.FLUENT,
        englishLevel.GOOD,
        englishLevel.NONE,
        englishLevel.NATIVE
      )
      .required(),
    previousOrganizingExperience: joi
      .string()
      .valid(
        previousOrganizingExperience.INFORMAL,
        previousOrganizingExperience.ONLINE,
        previousOrganizingExperience.OTHER,
        previousOrganizingExperience.PROF
      )
      .required(),
    placesOrganizedAtPreviously: joi.string().required(),
    AvailableAudience: joi
      .string()
      .valid(
        AvailableAudience.NOTNOW,
        AvailableAudience.LARGEGROUP,
        AvailableAudience.SMALLGROUP
      )
      .required(),
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateCreateForm,
}
