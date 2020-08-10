const joi = require('joi')
const validateCreate = (req, res, next) => {
  const schema = {
    title: joi.string().required(),
    description: joi.string().required(),
    category: joi.string().required(),
    attachedMedia: joi.string().required(),
    durationInHours: joi.double().required(),
    daysPerWeek: joi.integer().required(),
    sessionDuration: joi.double().required(),
    pricePerPerson: joi.double().required(),
    maxNumerOfAttendees: joi.integer().required(),
    minNumerOfAttendees: joi.integer().required(),
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateCreate,
}
