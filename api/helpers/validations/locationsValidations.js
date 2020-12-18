const Joi = require('joi')

const validateCreateLocations = (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      capacity: Joi.number().required(),
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
 
  
  module.exports = {
    validateCreateLocations,
  }