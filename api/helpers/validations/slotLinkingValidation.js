const Joi = require('joi')
const { min } = require('moment')
const PasswordComplexity = require('joi-password-complexity')

const {
  accountStatus,
  userTypes,
  memberType,
  days,
} = require('../../constants/GUC.enum')

const validateSlotLinkingRequest = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),
    slot: Joi.object({
      id: Joi.string().required(),
    }).required(),
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

const validateAcceptSlotLinkingRequest = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),

    slotLinkId: Joi.string().required(),
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

const validateViewSlotLinkingRequest = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),
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
  validateAcceptSlotLinkingRequest,
  validateSlotLinkingRequest,
  validateViewSlotLinkingRequest,
}
