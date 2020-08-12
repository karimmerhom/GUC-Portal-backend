const Joi = require('joi')

const validateCreateGiftPackageAccess = (req, res, next) => {
  const schema = Joi.object({
 
    gifting: Joi.string().valid(['true', 'false']).required(),
    Account: Joi.object({
      id: Joi.string().length(3).required(),
    }).required(),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 7002,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateEditGiftPackageAccess = (req, res, next) => {
  const schema = Joi.object({
       
    gifting: Joi.string().valid(['true', 'false']).required(),
    id: Joi.number().required(),
    Account: Joi.object({
      id: Joi.string().length(3).required(),
    }).required(),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 7002,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

module.exports = {
  validateCreateGiftPackageAccess,
  validateEditGiftPackageAccess
}
