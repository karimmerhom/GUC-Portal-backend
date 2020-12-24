const Joi = require('joi')

const validateRequestLeave = (req, res, next) => {
    const schema = Joi.object({
      academicId: Joi.string().required(),
      date: Joi.string().required(),
      type: Joi.string().valid(
        'compensation',
        'sick',
        'other',
        'annual'
    ).required(),
      reasonForCompensation: Joi.string()
      .when('type', {
        is: Joi.string().valid(['compensation']),
        then: Joi.string().required()
      })
      ,
    
      status: Joi.string(),
      comments: Joi.string()
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
    validateRequestLeave,

  }