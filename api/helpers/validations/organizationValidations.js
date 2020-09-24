const { role } = require('../../constants/TBH.enum')
const Joi = require('joi')
const errorCodes = require('../../constants/errorCodes')
const validateCreateOrganization = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    Members: Joi.array().items(
      Joi.object({
        email: Joi.string().email().required(),
        role: Joi.string().valid([role.MANAGER, role.USER]).required(),
      })
    ),
    organizationName: Joi.string().required(),
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
  validateCreateOrganization,
}
