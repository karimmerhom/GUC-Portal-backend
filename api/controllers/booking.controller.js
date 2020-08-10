const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const BookingModel = require('../../models/booking.model')
const CalendarModel = require('../../models/calendar.model')
const RoomModel = require('../../models/room.model')
const pricingModel = require('../../models/pricing.model')

const validator = require('../helpers/validations/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')

const {
  secretOrKey,
  smsAccessKey,
  contactAccessKey,
  emailAccessKey,
} = require('../../config/keys')
const { slots, calStatus, bookingStatus } = require('../constants/TBH.enum')
const {} = require('../helpers/helpers')
const { object } = require('joi')

const viewCalendar = async (req, res) => {
  try {
    var calendar = []
    const { startDate, filterRoomType, filterRoomSize } = req.body

    const rooms = await RoomModel.findAll()
    console.log(rooms.length)

    for (i = 0; i < rooms.length; i++) {
      console.log(rooms[i])
      var room = rooms[i]
      var r = {}
      r.roomNumber = room.roomNumber
      r.filtered = false
      r.notFreeSlots = {}

      if (room.roomType === filterRoomType) {
        r.filtered = true
        calendar.push(r)
      } else {
        const slots = await CalendarModel.findAll({
          where: {
            roomNumber: r.roomNumber,
            date: startDate,
          },
        })

        const notslots = slots.map((s) => {
          const sl = {
            slotName: s.slot,
            status: s.status,
          }
          return sl
        })

        r.notFreeSlots = notslots

        calendar.push(r)
      }
    }

    return res.json({ calendar, code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const bookRoom = async (req, res) => {
  try {
    let bookingDetails = req.body
    const status =
      bookingDetails.paymentMethod === 'points' ? 'confirmed' : 'pending'
    bookingDetails.status = status

    const roomFound = await RoomModel.findOne({
      where: { roomNumber: bookingDetails.roomNumber },
    })

    if (!roomFound) {
      res.json({ error: 'room doesnt exist', statusCode: 7000 })
    }

    bookingDetails.roomId = roomFound.id
    bookingDetails.accountId = req.body.Account.id

    let noAvailableSlots = false
    for (let i = 0; i < bookingDetails.slots.length; i++) {
      let sl = bookingDetails.slots[i]
      const notAvSl = await CalendarModel.findAll({
        where: {
          roomNumber: bookingDetails.roomNumber,
          date: bookingDetails.date,
          slot: sl,
        },
      })
      if (notAvSl.length !== 0) noAvailableSlots = true
    }

    console.log(noAvailableSlots)
    if (noAvailableSlots) {
      res.json({
        error: 'one room or more is/are busy in that timeslot',
        statusCode: 7000,
      })
    } else {
      const booked = await BookingModel.create(bookingDetails)
      for (let i = 0; i < bookingDetails.slots.length; i++) {
        let sl = bookingDetails.slots[i]
        console.log(
          bookingDetails.roomNumber,
          bookingDetails.date,
          bookingDetails.status,
          sl,
          booked.id
        )
        await CalendarModel.create({
          roomNumber: bookingDetails.roomNumber,
          date: bookingDetails.date,
          status: bookingDetails.status,
          slot: sl,
          bookingId: booked.id,
        })
      }

      return res.json({ statusCode: 0 })
    }
  } catch (e) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = { viewCalendar, bookRoom }
