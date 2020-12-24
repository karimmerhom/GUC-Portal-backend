const Joi = require('joi')
const {
  locationNames
} = require('../../constants/GUC.enum')

const validateCreateLocations = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        id: Joi.string().required(),
        academicId: Joi.string().required(),
      }).required(),
      name: Joi.string().required(),
      MaxCapacity: Joi.number().required(),
      type: Joi.string().required().valid(
       locationNames.LECTUREHALL,
       locationNames.ROOM,
       locationNames.OFFICE
      ),
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

  const validateAssignLocations = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        id: Joi.string().required(),
        academicId: Joi.string().required(),
      }).required(),
      academicId: Joi.string().required(),
      office: Joi.string().required().valid(
        locationNames.OFFICE
       ),
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

  const validateDeleteLocation = (req, res, next) => {
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

  const validateUpdateLocation = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        id: Joi.string().required(),
        academicId: Joi.string().required(),
      }).required(),
      name: Joi.string().required(),
      newName: Joi.string(),
      MaxCapacity: Joi.number(),
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
    validateCreateLocations,
    validateAssignLocations,
    validateDeleteLocation,
    validateUpdateLocation
  }