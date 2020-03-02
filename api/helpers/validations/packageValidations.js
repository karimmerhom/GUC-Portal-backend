const joi = require('joi')

const validateCreatePackage = request => {
  const schema = {
    Package: joi
      .object({
        numberOfHours: joi
          .number()
          .positive()
          .required(),
        package: joi
          .string()
          .valid(
            'MRSG10',
            'MRSG30',
            'MRSG50',
            'TRSG10',
            'TRSG30',
            'TRSG50',
            'MRLG10',
            'MRLG30',
            'MRLG50',
            'TRLG10',
            'TRLG30',
            'TRLG50',
            'MRFRSG',
            'MRFRLG',
            'TRFRSG',
            'TRFRLG'
          )
          .required(),
        roomType: joi.string().required()
      })
      .required(),
    Account: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateCancelSpecificPackage = request => {
  const schema = {
    Package: joi
      .object({
        code: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateCancelAllPackages = request => {
  const schema = {
    Package: joi
      .object({
        name: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateViewPackageByCode = request => {
  const schema = {
    Package: joi
      .object({
        code: joi.string().required()
      })
      .required(),
    Account: joi.object({ id: joi.number().required() }).required()
  }
  return joi.validate(request, schema)
}

const validateViewPackageByName = request => {
  const schema = {
    Package: joi
      .object({
        name: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateEditPackageByCode = request => {
  const schema = {
    Package: joi
      .object({
        code: joi.string().required(),
        status: joi
          .string()
          .valid(['canceled', 'active', 'used', 'pending'])
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateEditPackageByName = request => {
  const schema = {
    Package: joi
      .object({
        name: joi.string().required(),
        status: joi
          .string()
          .valid(['canceled', 'active', 'used'])
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateShowMyPackages = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateGiftPackage = request => {
  const schema = {
    Package: joi
      .object({
        numberOfHours: joi
          .number()
          .positive()
          .required(),
        roomType: joi
          .string()
          .valid('meeting room', 'training room')
          .required()
      })
      .required(),
    Account: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateCreatePackage,
  validateCancelAllPackages,
  validateCancelSpecificPackage,
  validateViewPackageByCode,
  validateViewPackageByName,
  validateEditPackageByCode,
  validateEditPackageByName,
  validateShowMyPackages,
  validateGiftPackage
}
