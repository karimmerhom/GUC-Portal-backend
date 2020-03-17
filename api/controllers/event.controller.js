const request = require('request')
const fs = require('fs')
const axios = require('axios')
const EventFormModel = require('../../models/eventForm.model')
const EventModel = require('../../models/event.model')
const InvitationsModel = require('../../models/invitations.model')
const RegisterationModel = require('../../models/register.model')
const AccountModel = require('../../models/account.model')
const errorCodes = require('../constants/errorCodes')
const {
  accountStatus,
  invitationStatus,
  userTypes
} = require('../constants/TBH.enum')
const validator = require('../helpers/validations/eventValidations')
const { emailAccessKey } = require('../../config/keys')
const {
  IsJsonString,
  sendEmailsToInQueue,
  cancelAllRegisterations
} = require('../helpers/helpers')

const create_event_form = async (req, res) => {
  try {
    if (IsJsonString(req.body.Event)) {
      req.body.Event = JSON.parse(req.body.Event)
    }
    const isValid = validator.validateCreateEvent(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account, Event } = req.body
    const account = await AccountModel.findOne({ where: { id: Account.id } })
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    if (account.status !== accountStatus.VERIFIED) {
      return res.json({
        code: errorCodes.unVerified,
        error: 'Account must be verified'
      })
    }
    const dateCheck =
      new Date().setHours(0, 0, 0, 0) -
      new Date(Event.dateFrom).setHours(0, 0, 0, 0)
    const dateFromToCheck =
      new Date(Event.dateTo).setHours(0, 0, 0, 0) -
      new Date(Event.dateFrom).setHours(0, 0, 0, 0)
    if (dateCheck > 0 || dateFromToCheck < 0) {
      return res.json({
        code: errorCodes.dateInThePast,
        error: 'From has to be before to'
      })
    }
    const text = `A new event announcement \nEvent name: ${Event.name} \nDate of event: From: ${Event.dateFrom}, To: ${Event.dateTo} 
    \nDescription: ${Event.description} \nType: ${Event.type} \nPrice: ${Event.price}`
    EventFormModel.create({
      accountId: Account.id,
      name: Event.name,
      type: Event.type,
      dateFrom: new Date(Event.dateFrom),
      dateTo: new Date(Event.dateTo),
      description: Event.description,
      price: Event.price
    })
    for (var key in req.files) {
      var item = req.files[key]
      await new Promise(resolve => {
        fs.writeFile(
          `${__dirname}/tbhappfiles/${item.name}`,
          item.data,
          function(err) {
            if (err) {
              resolve(err)
            }
            resolve('The file was saved!')
          }
        )
      })
    }

    let data = {}
    for (var key in req.files) {
      var item = req.files[key]
      data[item.name] = fs.createReadStream(
        `${__dirname}/tbhappfiles/${item.name}`
      )
    }
    data['body'] = JSON.stringify({
      receiverMail: 'info@thebusinesshub.space',
      body: text,
      subject: 'New Event Announcement'
    })
    data['header'] = JSON.stringify({
      accessKey: emailAccessKey
    })

    request(
      {
        url: 'https://cubexs.net/emailservice/sendemailattachment',
        method: 'POST',
        formData: data,
        json: true
      },
      (err, resp, body) => {
        console.log(err, resp, body)
      }
    )
    for (var key in req.files) {
      var item = req.files[key]
      fs.unlinkSync(`${__dirname}/tbhappfiles/${item.name}`)
    }

    return res.json({ code: 0 })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const invite_to_event = async (req, res) => {
  try {
    const isValid = validator.validateInviteToEvent(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account, Event, Invitee } = req.body
    const account = await AccountModel.findOne({ where: { id: Account.id } })

    const findEvent = await EventModel.findOne({ where: { id: Event.id } })
    if (!findEvent) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Event not found'
      })
    }
    if (findEvent.state !== invitationStatus.ACCEPTED) {
      return res.json({
        code: errorCodes.EventNotActive,
        error: 'Event not active'
      })
    }
    const findInvitation = await InvitationsModel.findOne({
      where: {
        accountId: Account.id,
        inviteeEmail: Invitee.email,
        eventId: Event.id
      }
    })
    if (findInvitation) {
      return res.json({
        code: errorCodes.invitationAlreadyExists,
        error: 'This user has already been invited to this event'
      })
    }
    await InvitationsModel.create({
      accountId: Account.id,
      inviteeEmail: Invitee.email,
      eventId: Event.id
    })
    axios({
      method: 'post',
      url: 'https://cubexs.net/emailservice/sendemail',
      data: {
        header: {
          accessKey: emailAccessKey
        },
        body: {
          receiverMail: Invitee.email,
          body: `${account.firstName} ${account.lastName} has invited you to this event \nlink`,
          subject: 'Invitation to an event'
        }
      }
    })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const register_to_event = async (req, res) => {
  try {
    const isValid = validator.validateRegisterToEvent(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account, Event } = req.body
    const account = await AccountModel.findOne({ where: { id: Account.id } })

    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    if (account.status !== accountStatus.VERIFIED) {
      return res.json({
        code: errorCodes.unVerified,
        error: 'Account must be verified'
      })
    }
    const findEvent = await EventModel.findOne({ where: { id: Event.id } })
    if (!findEvent) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Event not found'
      })
    }
    if (findEvent.state !== invitationStatus.ACCEPTED) {
      return res.json({
        code: errorCodes.EventNotActive,
        error: 'Event not active'
      })
    }
    const findRegisteration = await RegisterationModel.findOne({
      where: { accountId: Account.id, eventId: Event.id }
    })
    if (
      findRegisteration &&
      findRegisteration.state !== invitationStatus.INQUEUE
    ) {
      return res.json({
        code: errorCodes.invitationAlreadyExists,
        error: 'You already tried to register to this event'
      })
    }
    if (findEvent.amountOfPeople + 1 > findEvent.maxNoOfPeople) {
      await RegisterationModel.create({
        accountId: Account.id,
        eventId: Event.id,
        state: invitationStatus.INQUEUE
      })
      return res.json({
        code: errorCodes.reachedMaximumAmountOfPeopleEvent,
        error: 'This event has no remaining places left'
      })
    }

    if (
      findRegisteration &&
      findRegisteration.state === invitationStatus.INQUEUE
    ) {
      await RegisterationModel.update(
        { state: invitationStatus.PENDING },
        {
          where: {
            accountId: Account.id,
            eventId: Event.id
          }
        }
      )
    } else {
      if (!findRegisteration)
        await RegisterationModel.create({
          accountId: Account.id,
          eventId: Event.id
        })
    }
    await EventModel.update(
      { amountOfPeople: findEvent.amountOfPeople + 1 },
      { where: { id: Event.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const show_event = async (req, res) => {
  try {
    const isValid = validator.validateShowEvent(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Event } = req.body
    const events = await EventModel.findOne({ where: { id: Event.id } })
    return res.json({ code: errorCodes.success, events })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const show_all_events = async (req, res) => {
  try {
    const events = await EventModel.findAll({
      where: { state: invitationStatus.ACCEPTED }
    })
    return res.json({ code: errorCodes.success, events })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const invite_collaborator = async (req, res) => {
  try {
    const isValid = validator.validateInviteToCollaborator(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Event, Account, Invitee } = req.body
    const findEvent = await EventModel.findOne({
      where: { id: Event.id }
    })
    if (!findEvent) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Event not found'
      })
    }
    const account = await AccountModel.findOne({
      where: { id: parseInt(Account.id) }
    })
    if (!account) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Account not found'
      })
    }
    if (account.status !== accountStatus.VERIFIED) {
      return res.json({
        code: errorCodes.unVerified,
        error: 'Account must be verified'
      })
    }
    let arrayOfCollaboraters = []
    if (req.data.type !== userTypes.ADMIN) {
      if (
        findEvent.collaborators === null ||
        !findEvent.collaborators.includes(parseInt(Account.id))
      ) {
        return res.json({
          code: errorCodes.collaboratorExists,
          error: 'You are not a collaborator'
        })
      }
    }
    console.log(findEvent.collaborators)
    if (
      findEvent.collaborators !== null &&
      findEvent.collaborators.includes(parseInt(Invitee.id))
    ) {
      return res.json({
        code: errorCodes.collaboratorExists,
        error: 'Collaborator already added'
      })
    }
    if (findEvent.collaborators === null) arrayOfCollaboraters = []
    else arrayOfCollaboraters = findEvent.collaborators
    arrayOfCollaboraters.push(Invitee.id)
    await EventModel.update(
      { collaborators: arrayOfCollaboraters },
      { where: { id: Event.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const remove_collaborator = async (req, res) => {
  try {
    const isValid = validator.validateInviteToCollaborator(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Event, Account, Invitee } = req.body
    const findEvent = await EventModel.findOne({
      where: { id: Event.id }
    })
    if (!findEvent) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Event not found'
      })
    }
    const account = await AccountModel.findOne({
      where: { id: parseInt(Account.id) }
    })
    if (!account) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Account not found'
      })
    }

    let arrayOfCollaboraters = []
    if (req.data.type !== userTypes.ADMIN) {
      if (
        findEvent.collaborators === null ||
        !findEvent.collaborators.includes(parseInt(Account.id))
      ) {
        return res.json({
          code: errorCodes.collaboratorExists,
          error: 'You are not a collaborator'
        })
      }
    }

    if (!findEvent.collaborators.includes(parseInt(Invitee.id))) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Collaborator not added'
      })
    }
    arrayOfCollaboraters = findEvent.collaborators
    arrayOfCollaboraters.pop(Invitee.id)
    await EventModel.update(
      { collaborators: arrayOfCollaboraters },
      { where: { id: Event.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const edit_event_information = async (req, res) => {
  try {
    const isValid = validator.validateEditEventInfo(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account, Event } = req.body
    const findEvent = await EventModel.findOne({ where: { id: Event.id } })
    if (!findEvent) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Event not found'
      })
    }
    if (req.data.type !== userTypes.ADMIN) {
      if (
        findEvent.collaborators === null ||
        !findEvent.collaborators.includes(parseInt(Account.id))
      ) {
        return res.json({
          code: errorCodes.collaboratorExists,
          error: 'You are not a collaborator'
        })
      }
    }
    await EventModel.update(Event.Info, { where: { id: Event.id } })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

// const show_my_event_forms = async (req, res) => {
//   try {
//     const events = await EventFormModel.findAll({
//       where: { accountId: req.data.id }
//     })
//     return res.json({ code: errorCodes.success, events })
//   } catch (exception) {
//     return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
//   }
// }

// const accept_reject_invitation = async (req, res) => {
//   try {
//     const isValid = validator.validateInviteToEvent(req.body)
//     if (isValid.error) {
//       return res.json({
//         code: errorCodes.validation,
//         error: isValid.error.details[0].message
//       })
//     }
//     const { Account } = req.body
//     const account = await AccountModel.findOne({ where: { id: Account.id } })

//     if (!account) {
//       return res.json({
//         code: errorCodes.invalidCredentials,
//         error: 'User not found'
//       })
//     }
//     if (account.status !== accountStatus.VERIFIED) {
//       return res.json({
//         code: errorCodes.unVerified,
//         error: 'Account must be verified'
//       })
//     }

//     const findInvitation = await InvitationsModel.findOne({
//       where: { accountId: Account.id, inviteeId: Account.id, eventId: Event.id }
//     })
//     if (!findInvitation) {
//       return res.json({
//         code: errorCodes.entityNotFound,
//         error: 'No invitation found'
//       })
//     }
//     await InvitationsModel.update(
//       { state: Account.state },
//       {
//         where: {
//           accountId: Account.id,
//           inviteeId: Invitee.id,
//           eventId: Event.id
//         }
//       }
//     )
//     return res.json({ code: errorCodes.success })
//   } catch (exception) {
//     console.log(exception)
//     return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
//   }
// }

/////////////////////////////ADMIN/////////////////////////////
const edit_registeration_admin = async (req, res) => {
  try {
    const isValid = validator.validateEditRegisterToEvent(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account, Event } = req.body
    const account = await AccountModel.findOne({ where: { id: Account.id } })
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    const findEvent = await EventModel.findOne({ where: { id: Event.id } })
    if (!findEvent) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Event not found'
      })
    }
    const findRegisteration = await RegisterationModel.findOne({
      where: { accountId: Account.id, eventId: Event.id }
    })
    if (!findRegisteration) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'No registeration for this user'
      })
    }
    RegisterationModel.update(
      { state: Event.state },
      { where: { accountId: Account.id, eventId: Event.id } }
    )

    if (
      Event.state === invitationStatus.REJECTED &&
      findRegisteration.state !== invitationStatus.REJECTED
    ) {
      sendEmailsToInQueue(Event.id, findEvent.name)
      EventModel.update(
        { amountOfPeople: findEvent.amountOfPeople - 1 },
        { where: { id: Event.id } }
      )
    }
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const edit_event_admin = async (req, res) => {
  try {
    const isValid = validator.validateEditEventAdmin(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Event } = req.body
    const findEvent = await EventModel.findOne({
      where: { id: Event.id }
    })
    if (!findEvent) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Event not found'
      })
    }
    await EventModel.update({ state: Event.state }, { where: { id: Event.id } })
    if (Event.state === accountStatus.CANCELED) {
      cancelAllRegisterations(Event.id)
    }
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const create_event_admin = async (req, res) => {
  try {
    const isValid = validator.validateCreateEventAdmin(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Event } = req.body
    const dateCheck =
      new Date().setHours(0, 0, 0, 0) -
      new Date(Event.dateFrom).setHours(0, 0, 0, 0)
    const dateFromToCheck =
      new Date(Event.dateTo).setHours(0, 0, 0, 0) -
      new Date(Event.dateFrom).setHours(0, 0, 0, 0)
    if (dateCheck > 0 || dateFromToCheck < 0) {
      return res.json({
        code: errorCodes.dateInThePast,
        error: 'From has to be before to'
      })
    }
    await EventModel.create({
      name: Event.name,
      type: Event.type,
      dateFrom: new Date(Event.dateFrom),
      dateTo: new Date(Event.dateTo),
      description: Event.description,
      price: Event.price,
      maxNoOfPeople: Event.maxNoOfPeople,
      amountOfPeople: 0
    })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  create_event_form,
  invite_to_event,
  register_to_event,
  edit_registeration_admin,
  edit_event_admin,
  show_event,
  show_all_events,
  // show_all_events_accepted,
  // show_my_events,
  create_event_admin,
  invite_collaborator,
  remove_collaborator,
  edit_event_information
}
