const Joi = require('joi')

const validateCreatePackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().length(24).required() }).required(),
    packageName: Joi.string().min(3).required(),
    expiryDuration: Joi.number().required(),
    packageType: Joi.string().valid(['regular', 'extreme']).required(),

    price: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['regular']),
        then: Joi.number().required()
      }),

    points: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['regular']),
        then: Joi.number().required()
      }),

    largePrice: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number().required()
      }),
     
    smallPrice: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number().required()
      }),

    daysPerWeek: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number().required()
      }),

    startPeriod: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number().required()
      }),

    endPeriod: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number().required()
      }),
    
  })
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: 7001,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}


module.exports = {
  validateCreatePackage,
}
