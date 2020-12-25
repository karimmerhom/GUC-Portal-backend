const Joi = require('joi')
const { leaveStatus, leaveTypes } = require('../../../api/constants/GUC.enum')

const validateCreateReplacementRequest = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        id: Joi.string().required(),
        academicId: Joi.string().required(),
      }).required(),
      academicIdReciever: Joi.string().required(),
      day: Joi.string()
        .regex(/^(3[01]|[12][0-9]|[1-9])$/)
        .min(1)
        .max(2)
        .required(),
      month: Joi.string()
        .regex(/^[2-9]|1[0-2]?$/)
        .min(1)
        .max(2)
        .required(),
      year: Joi.string().min(4).required(),
      slotId: Joi.string().required(),
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

  const validateViewRecievedReq = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
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
  
  const validateUpdateReplacementRequestStatus = (req, res, next) => {
    const schema = Joi.object({
      Account: Joi.object({
        academicId: Joi.string().required(),
      }).required(),
      reqId: Joi.string().min(24).required(),
      status: Joi.string().required().valid(
        leaveStatus.ACCEPTED,
        leaveStatus.REJECTED
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
  
  module.exports = {
    validateCreateReplacementRequest,
    validateViewRecievedReq,
    validateUpdateReplacementRequestStatus
  }