const Joi = require('joi')
const errorCodes = require('../../constants/errorCodes')
const validateCreateBookingExpiration = (req, res, next) => {
  const schema = Joi.object({
    
    expiryPeriod: Joi.number().required(),
    expiry: Joi.string().valid(['true', 'false']).required(),
    Account: Joi.object({
      id: Joi.string().length(3).required(),
    }).required(),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: errorCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateEditBookingExpiration = (req, res, next) => {
  const schema = Joi.object({
       
    expiryPeriod: Joi.number(),
    expiry: Joi.string().valid(['true', 'false']),
    id: Joi.number().required(),
    Account: Joi.object({
      id: Joi.string().length(3).required(),
    }).required(),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: errorCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateDeleteBookingExpiration = (req, res, next) => {
  const schema = Joi.object({
    
    id: Joi.number().required(),
    Account: Joi.object({
      id: Joi.string().length(3).required(),
    }).required(),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: errorCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

module.exports = {
  validateCreateBookingExpiration,
  validateEditBookingExpiration,
  validateDeleteBookingExpiration
}
