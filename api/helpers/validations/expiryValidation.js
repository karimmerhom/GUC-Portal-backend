const Joi = require('joi')
const statusCodes = require('../../constants/errorCodes')

const {
  roomType,
  roomSize,
  slots,
  paymentMethods,
} = require('../../constants/TBH.enum')

const validateSetExpiryDuration = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    duration: Joi.number().required(),
  }

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: statusCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

module.exports = {
  validateSetExpiryDuration,
}
