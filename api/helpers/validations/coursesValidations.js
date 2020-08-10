const joi = require('joi')
const validateCreate = (req, res, next) => {
  const schema = {
    title: joi.string().required(),
    description: joi.string().required(),
    category: joi.string().required(),
    attachedMedia: joi.string().required(),
    durationInHours: joi.string().required(),
    daysPerWeek: joi.string().required(),
    sessionDuration: joi.string().required(),
    pricePerPerson: joi.string().required(),
    maxNumerOfAttendees: joi.string().required(),
    minNumerOfAttendees: joi.string().required(),
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateCreate,
}
