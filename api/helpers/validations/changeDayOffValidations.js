const Joi = require('joi')
const {leaveStatus,days} = require('../../constants/GUC.enum')
const validateRequestChangeDayOff = (req, res, next) => {
    const schema = Joi.object({
      academicId: Joi.string().required(),
      newDayOff: Joi.string()
          .valid(
            days.SATURDAY,
            days.SUNDAY,
            days.MONDAY,
            days.TUESDAY,
            days.WEDNESDAY,
            days.THURSDAY
          )
          .required(),
      reason: Joi.string()
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

const validateUpdateRequest = (req, res, next) => {
    const schema = Joi.object({
      account: Joi.object({
        academicId: Joi.string().required(),
      }).required(),
      reqId: Joi.string().min(24).required(),
      status: Joi.string().required().valid(
        leaveStatus.ACCEPTED,
        leaveStatus.REJECTED
       ),
       hodComment: Joi.string()
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
    validateRequestChangeDayOff,
    validateUpdateRequest

  }