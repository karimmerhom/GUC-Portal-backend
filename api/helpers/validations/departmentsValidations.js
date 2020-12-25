const Joi = require('joi')

const validateCreateDepartment = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        academicId: Joi.string().required(),
      }).required(),
      name: Joi.string().required(),
      faculty: Joi.string().required(),
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

const validateDeleteDepartment = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        academicId: Joi.string().required(),
      }).required(),
      name: Joi.string().required(),
      faculty: Joi.string().required(),

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
  
  const validateUpdateDepartment = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        
        academicId: Joi.string().required(),
      }).required(),
      name: Joi.string().required(),
      faculty: Joi.string().required(),
      department: Joi.object({
        name: Joi.string(),
        faculty: Joi.string(),
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
    validateDeleteDepartment,
    validateCreateDepartment,
    validateUpdateDepartment,
  }
  