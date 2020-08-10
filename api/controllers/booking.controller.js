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
const { calendar } = require('googleapis/build/src/apis/calendar')

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

const cancelBooking = async (req, res) => {
  try {
    const { Account, bookingId } = req.body
    const accountId = Account.id
    const booking = await BookingModel.findOne({
      where: {
        id: bookingId,
      },
    })
    if (booking) {
      if (booking.status == bookingStatus.CANCELED) {
        return res.json({ statusCode: 7000, error: 'booking already canceled' })
      }
      if (booking.accountId !== accountId) {
        return res.json({ statusCode: 7000, error: 'Not the users booking' })
      }

      await BookingModel.update(
        { status: bookingStatus.CANCELED },
        { where: { id: bookingId } }
      )
      console.log('YYYY')
      await CalendarModel.destroy({
        where: { bookingId: bookingId },
      })
      console.log('YYYY')

      return res.json({ code: errorCodes.success })
    } else {
      return res.json({ statusCode: 7000, error: 'booking not found' })
    }
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewMyBookings = async (req, res) => {
  try {
    const { Account } = req.body

    id = Account.id

    const booking = await BookingModel.findAll({
      where: {
        accountId: id,
        status: { [Op.not]: bookingStatus.CANCELED },
      },
    })
    if (booking === []) {
      return res.json({ statusCode: 7000, error: 'No bookings not found' })
    } else {
      return res.json({ booking, code: errorCodes.success })
    }
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewAllBookings = async (req, res) => {
  try {
    const booking = await BookingModel.findAll()

    return res.json({ booking, code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewDateBookings = async (req, res) => {
  try {
    const { date } = req.body

    const booking = await BookingModel.findAll({
      where: {
        date: date,
      },
    })
    if (booking === []) {
      return res.json({ statusCode: 7000, error: 'No bookings not found' })
    } else {
      return res.json({ booking, code: errorCodes.success })
    }
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}
module.exports = {
  viewCalendar,
  cancelBooking,
  viewMyBookings,
  viewDateBookings,
  viewAllBookings,
}
