const joi = require('joi')
const { invitationStatus } = require('../../constants/TBH.enum')

const validateInviteToEvent = request => {
  const schema = {
    Event: joi
      .object({
        id: joi.number().required()
      })
      .required(),
    Account: joi
      .object({
        id: joi.number().required()
      })
      .required(),
    Invitee: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateCreateEvent = request => {
  const schema = {
    Account: joi.object({ id: joi.number().required() }).required(),
    Event: joi
      .object({
        name: joi.string().required(),
        dateFrom: joi.date().required(),
        dateTo: joi.date().required(),
        description: joi.string().required(),
        type: joi.string().required(),
        price: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}
const validateRegisterToEvent = request => {
  const schema = {
    Account: joi.object({ id: joi.number().required() }).required(),
    Event: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}
const validateEditRegisterToEvent = request => {
  const schema = {
    Account: joi.object({ id: joi.number().required() }).required(),
    Event: joi
      .object({
        id: joi.number().required(),
        state: joi
          .string()
          .valid(
            invitationStatus.REGISTERED,
            invitationStatus.REJECTED,
            invitationStatus.PENDING
          )
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateEditEventAdmin = request => {
  const schema = {
    Event: joi
      .object({
        id: joi.number().required(),
        state: joi
          .string()
          .valid(
            invitationStatus.ACCEPTED,
            invitationStatus.REJECTED,
            invitationStatus.PENDING
          )
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateShowEvent = request => {
  const schema = {
    Event: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateCreateEventAdmin = request => {
  const schema = {
    Event: joi
      .object({
        name: joi.string().required(),
        dateFrom: joi.date().required(),
        dateTo: joi.date().required(),
        description: joi.string().required(),
        type: joi.string().required(),
        price: joi.number().required(),
        maxNoOfPeople: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateInviteToEvent,
  validateCreateEvent,
  validateRegisterToEvent,
  validateEditRegisterToEvent,
  validateEditEventAdmin,
  validateShowEvent,
  validateCreateEventAdmin
}
