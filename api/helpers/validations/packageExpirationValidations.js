const Joi = require('joi')
const errorCodes = require('../../constants/errorCodes')
const validateCreatePackageExpiration = (req, res, next) => {
  const schema = Joi.object({
    
   
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

const validateEditPackageExpiration = (req, res, next) => {
  const schema = Joi.object({
       

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

const validateDeletePackageExpiration = (req, res, next) => {
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
  validateCreatePackageExpiration,
  validateEditPackageExpiration,
  validateDeletePackageExpiration
}