const axios = require('axios')

const EventModel = require('../../models/events.model')
const errorCodes = require('../constants/errorCodes')
const validator = require('../helpers/bookingValidations')
const { emailAccessKey } = require('../../config/keys')

const create_event = async (req, res) => {
  try {
    const isValid = validator.validateCreateEvent(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account, Event } = req.body
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
    axios({
      method: 'post',
      url: 'https://cubexs.net/emailservice/sendemail',
      data: {
        header: {
          accessKey: emailAccessKey
        },
        body: {
          receiverMail: 'elhobbakhaless@gmail.com',
          body: text,
          subject: 'New Event Announcement'
        }
      }
    })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = { create_event }
