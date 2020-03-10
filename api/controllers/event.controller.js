const request = require('request')
const fs = require('fs')

const EventModel = require('../../models/events.model')
const InvitationsModel = require('../../models/invitations.model')
const RegisterationModel = require('../../models/register.model')
const AccountModel = require('../../models/account.model')
const errorCodes = require('../constants/errorCodes')
const { accountStatus, invitationStatus } = require('../constants/TBH.enum')
const validator = require('../helpers/validations/eventValidations')
const { emailAccessKey } = require('../../config/keys')
const { IsJsonString } = require('../helpers/helpers')

const create_event = async (req, res) => {
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
    EventModel.create({
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
    const inviteeAccount = await AccountModel.findOne({
      where: { id: Invitee.id }
    })
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
    if (!inviteeAccount) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'Invitee not found'
      })
    }
    const findEvent = await EventModel.findOne({ where: { id: Event.id } })
    if (!findEvent) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Event not found'
      })
    }
    const findInvitation = await InvitationsModel.findOne({
      where: { accountId: Account.id, inviteeId: Invitee.id, eventId: Event.id }
    })
    console.log(findInvitation)
    if (findInvitation) {
      return res.json({
        code: errorCodes.invitationAlreadyExists,
        error: 'This user has already been invited to this event'
      })
    }
    await InvitationsModel.create({
      accountId: Account.id,
      inviteeId: Invitee.id,
      eventId: Event.id
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
    const findRegisteration = await RegisterationModel.findOne({
      where: { accountId: Account.id, eventId: Event.id }
    })
    if (
      findRegisteration &&
      findRegisteration.state === invitationStatus.PENDING
    ) {
      return res.json({
        code: errorCodes.invitationAlreadyExists,
        error: 'You already tried to register to this event'
      })
    }
    await RegisterationModel.create({
      accountId: Account.id,
      eventId: Event.id
    })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

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
    const findRegisteration = await RegisterationModel.findOne({
      where: { accountId: Account.id, eventId: Event.id }
    })
    if (!findRegisteration) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'No registeration for this user'
      })
    }
    await RegisterationModel.update(
      { state: invitationStatus.REGISTERED },
      { where: { accountId: Account.id, eventId: Event.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  create_event,
  invite_to_event,
  register_to_event,
  edit_registeration_admin
}
