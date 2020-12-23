const Joi = require('joi')
const { min } = require('moment')
const PasswordComplexity = require('joi-password-complexity')

const {
  accountStatus,
  userTypes,
  memberType,
  days,
  slotNames,
} = require('../../constants/GUC.enum')

const validateCreateSlot = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),

    slot: Joi.object({
      day: Joi.string()
        .valid(
          days.SATURDAY,
          days.SUNDAY,
          days.MONDAY,
          days.TUESDAY,
          days.WEDNESDAY,
          days.THURSDAY
        )
        .required(),
      courseId: Joi.string().required(),
      slot: Joi.string()
        .valid(
          slotNames.FIRST,
          slotNames.SECOND,
          slotNames.THIRD,
          slotNames.FOURTH,
          slotNames.FIFTH
        )
        .required(),
      assignedAcademicId: Joi.string(),
      locationName: Joi.string().required(),
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
const validateDeleteSlot = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),

    slot: Joi.object({
      day: Joi.string()
        .valid(
          days.SATURDAY,
          days.SUNDAY,
          days.MONDAY,
          days.TUESDAY,
          days.WEDNESDAY,
          days.THURSDAY
        )
        .required(),
      slot: Joi.string()
        .valid(
          slotNames.FIRST,
          slotNames.SECOND,
          slotNames.THIRD,
          slotNames.FOURTH,
          slotNames.FIFTH
        )
        .required(),
      locationName: Joi.string().required(),
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
const validateAssignSlot = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.string().required(),
      academicId: Joi.string().required(),
    }).required(),

    slot: Joi.object({
      day: Joi.string()
        .valid(
          days.SATURDAY,
          days.SUNDAY,
          days.MONDAY,
          days.TUESDAY,
          days.WEDNESDAY,
          days.THURSDAY
        )
        .required(),
      slot: Joi.string()
        .valid(
          slotNames.FIRST,
          slotNames.SECOND,
          slotNames.THIRD,
          slotNames.FOURTH,
          slotNames.FIFTH
        )
        .required(),
      locationName: Joi.string().required(),
    }).required(),

    assignedAcademicId: Joi.string().required(),
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
  validateCreateSlot,
  validateDeleteSlot,
  validateAssignSlot,
}
