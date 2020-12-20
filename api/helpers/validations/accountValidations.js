const Joi = require('joi')
const { min } = require('moment')

const {
  accountStatus,
  userTypes,
  memberType,
  days,
} = require('../../constants/GUC.enum')

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(3).required(),
      phoneNumber: Joi.string().min(11).max(11).required(),
      type: Joi.string()
        .valid(userTypes.HR, userTypes.ACADEMICMEMBER)
        .required(),
      memberType: Joi.string().valid(
        memberType.MEMBER,
        memberType.HOD,
        memberType.INSTRUCTOR,
        memberType.COORDINATOR
      ),
      daysOff: Joi.string().valid(
        days.SATURDAY,
        days.SUNDAY,
        days.MONDAY,
        days.TUESDAY,
        days.WEDNESDAY,
        days.THURSDAY
      ),
      email: Joi.string().email().required(),
      gender: Joi.string().valid('male', 'female'),
    }),
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
  validateRegister,
}
