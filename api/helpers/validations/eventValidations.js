const joi = require('joi')
const { invitationStatus, accountStatus } = require('../../constants/TBH.enum')

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
        email: joi
          .string()
          .email()
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateEditEventInfo = request => {
  const schema = {
    Event: joi
      .object({
        id: joi.number().required(),
        Info: joi
          .object({
            link: joi.string(),
            facebookPage: joi.string(),
            instagramPage: joi.string(),
            roomLayout: joi.string(),
            maxNoOfPeople: joi.number(),
            services: joi
              .array()
              .items(joi.string())
              .min(1)
          })
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

const validateInviteToCollaborator = request => {
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

const validateAddCollaborator = request => {
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
          .valid(invitationStatus.ACCEPTED, accountStatus.CANCELED)
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
  validateCreateEventAdmin,
  validateAddCollaborator,
  validateInviteToCollaborator,
  validateEditEventInfo
}
