const { packageStatus, packageType } = require('../../constants/TBH.enum')

const Joi = require('joi')
const errorCodes = require('../../constants/errorCodes')

const validateCreatePackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    packageName: Joi.string().min(3).required(),
    expiryDuration: Joi.number().required(),
    packageType: Joi.string().valid(['regular', 'extreme']).required(),

    price: Joi.number().when('packageType', {
      is: Joi.string().valid(['regular']),
      then: Joi.number().required(),
    }),

    points: Joi.number().when('packageType', {
      is: Joi.string().valid(['regular']),
      then: Joi.number().required(),
    }),

    largePrice: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number().required(),
    }),

    smallPrice: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number().required(),
    }),

    daysPerWeek: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number().required(),
    }),

    startPeriod: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number().required(),
    }),

    endPeriod: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number().required(),
    }),
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

const validatePurchasePackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    packageId: Joi.string().required(),
    packageType: Joi.string()
      .valid([packageType.EXTREME, packageType.REGULAR])
      .required(),
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

const validateCancelPackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    packageId: Joi.string().required(),
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

const validateViewMyPackages = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
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

const validateEditPackage = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    id: Joi.number().required(),
    packageName: Joi.string().min(3),
    expiryDuration: Joi.number(),
    packageType: Joi.string().valid(['regular', 'extreme']).required(),

    price: Joi.number().when('packageType', {
      is: Joi.string().valid(['regular']),
      then: Joi.number(),
    }),

    points: Joi.number().when('packageType', {
      is: Joi.string().valid(['regular']),
      then: Joi.number(),
    }),

    largePrice: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number(),
    }),

    smallPrice: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number(),
    }),

    daysPerWeek: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number(),
    }),

    startPeriod: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number(),
    }),

    endPeriod: Joi.number().when('packageType', {
      is: Joi.string().valid(['extreme']),
      then: Joi.number(),
    }),
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

const validateViewPackage = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    packageType: Joi.string().valid(['regular', 'extreme']).required(),
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

const validateViewAllPackages = (req, res, next) => {
  const schema = Joi.object({
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

const validateViewMyPurchases = (req, res, next) => {
  const schema = Joi.object({
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

const validateRedeemGift = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    otpCode: Joi.string().required(),
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

const validateSendGift = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    email: Joi.string().required(),
    points: Joi.string().required(),
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

const validateEditStatus = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({ id: Joi.string().required() }).required(),
    purchasedPackageId: Joi.string().required(),
    status: Joi.string()
      .valid([
        packageStatus.EXPIRED,
        packageStatus.CANCELED,
        packageStatus.PENDING,
        packageStatus.ACTIVE,
      ])
      .required(),
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
  validateRedeemGift,
  validateSendGift,
  validateCreatePackage,
  validateEditPackage,
  validateViewPackage,
  validateViewAllPackages,
  validatePurchasePackage,
  validateCancelPackage,
  validateViewMyPackages,
  validateSendGift,
  validateRedeemGift,
  validateEditStatus,
  validateViewMyPurchases,
}
