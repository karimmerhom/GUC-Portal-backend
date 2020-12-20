const Joi = require('joi')

const validateCreateLocations = (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      MaxCapacity: Joi.number().required(),
      type: Joi.string().required(),
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

  const validateAssignLocations = (req, res, next) => {
    const schema = Joi.object({
      academicId: Joi.string().required(),
      office: Joi.string().required(),
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
    validateCreateLocations,
    validateAssignLocations
  }