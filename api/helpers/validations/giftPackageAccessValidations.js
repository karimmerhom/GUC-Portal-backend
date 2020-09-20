const Joi = require('joi')
const errorCodes = require('../../constants/errorCodes')

const validateEditGiftPackageAccess = (req, res, next) => {
  const schema = Joi.object({
    gifting: Joi.bool().required(),
    Account: Joi.object({
      id: Joi.string().required(),
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
  validateEditGiftPackageAccess,
}
