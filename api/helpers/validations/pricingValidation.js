const Joi = require('joi')
const statusCodes = require('../../constants/errorCodes')

const {
  roomType,
  roomSize,
  slots,
  paymentMethods,
} = require('../../constants/TBH.enum')

const validateCreatePricing = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    pricingType: Joi.string().required().valid(['points', 'flat_rate']),
    roomType: Joi.string().required().valid([roomSize.LARGE, roomSize.SMALL]),
    value: Joi.number().required(),
    unit: Joi.string().required(),
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

const validateEditPricing = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    pricingType: Joi.string().required().valid(['points', 'flat_rate']),
    roomType: Joi.string().required().valid([roomSize.LARGE, roomSize.SMALL]),
    value: Joi.number().required(),
    unit: Joi.string().required(),
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

const validateDeletePricing = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    pricingType: Joi.string().required().valid(['points', 'flat_rate']),
    roomType: Joi.string().required().valid([roomSize.LARGE, roomSize.SMALL]),
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

const validateViewPricing = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
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
  validateCreatePricing,
  validateDeletePricing,
  validateEditPricing,
  validateViewPricing,
}
