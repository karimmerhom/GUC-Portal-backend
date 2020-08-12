const Joi = require('joi')

const validateCreatePackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
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

const validatePurchasePackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    packageId: Joi.string().required(),
    packageType: Joi.string().valid(['regular', 'extreme']).required(),
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

const validateCancelPackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().length(3).required() }).required(),
    Id: Joi.string().required(),
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

const validateViewMyPackages = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().length(3).required() }).required(),
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

const validateEditPackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().length(24).required() }).required(),
    id:Joi.number().required(),
    packageName: Joi.string().min(3),
    expiryDuration: Joi.number(),
    packageType: Joi.string().valid(['regular', 'extreme']).required(),

    price: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['regular']),
        then: Joi.number()
      }),

    points: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['regular']),
        then: Joi.number()
      }),

    largePrice: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number()
      }),
     
    smallPrice: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number()
      }),

    daysPerWeek: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number()
      }),

    startPeriod: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number()
      }),

    endPeriod: Joi.number()
      .when('packageType', {
        is: Joi.string().valid(['extreme']),
        then: Joi.number()
      }),
    
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


const validateViewPackage = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    packageType: Joi.string().valid(['regular', 'extreme']).required(),
    Account: Joi.object({
      id: Joi.string().length(24).required(),
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

const validateViewAllPackages = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().length(24).required(),
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
  validateCreatePackage,
  validateEditPackage,
  validateViewPackage,
  validateViewAllPackages,
  validatePurchasePackage,
  validateCancelPackage,
  validateViewMyPackages
}
