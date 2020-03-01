const request = require('request')
const fs = require('fs')

const EventModel = require('../../models/events.model')
const errorCodes = require('../constants/errorCodes')
const validator = require('../helpers/validations/bookingValidations')
const { emailAccessKey } = require('../../config/keys')
const { IsJsonString } = require('../helpers/helpers')

const create_event = async (req, res) => {
  try {
    if (IsJsonString(req.body.Event)) {
      req.body.Event = JSON.parse(req.body.Event)
      req.body.Account = JSON.parse(req.body.Account)
    }
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
        url: 'http://localhost:2000/emailservice/sendemailattachment',
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

module.exports = { create_event }
