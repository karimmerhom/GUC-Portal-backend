const Joi = require('joi')

const validateCreatefaculty = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        id: Joi.string().required(),
        academicId: Joi.string().required(),
      }).required(),
      name: Joi.string().required(),
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
  const validateDeleteFaculty = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        id: Joi.string().required(),
        academicId: Joi.string().required(),
      }).required(),
      name: Joi.string().required(),
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

  const validateUpdateFaculty = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        id: Joi.string().required(),
        academicId: Joi.string().required(),
      }).required(),
      name: Joi.string().required(),
      faculty: Joi.object({
        name: Joi.string(),
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
    validateCreatefaculty,
    validateDeleteFaculty,
    validateUpdateFaculty
  }