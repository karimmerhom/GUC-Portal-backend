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

      if (
        room.roomType !== filterRoomType ||
        room.roomSize !== filterRoomSize
      ) {
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
const editBooking = async (req, res) => {
  try {
    const booked = await BookingModel.findOne({
      where: { id: req.body.bookingId },
    })
    if (booked) {
      let bookingDetails = req.body
      const status =
        bookingDetails.paymentMethod === 'points' ? 'confirmed' : 'pending'
      bookingDetails.status = status

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
      if (noAvailableSlots) {
        res.json({
          error: 'one room or more is/are busy in that timeslot',
          statusCode: 7000,
        })
      } else {
        let foundSlots = await CalendarModel.findAll({
          where: {
            bookingId: booked.id,
          },
        })
        foundSlots.map((slot) => {
          slot.destroy()
        })

        booked.destroy()
        bookRoom(req, res)
        return res.json({ code: errorCodes.success })
      }
    } else {
      return res.json({ code: errorCodes.unknown, error: 'Booking not found' })
    }
  } catch (e) {
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
const tryBooking = async (req, res) => {
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
      const pricing = calculatePrice(
        bookingDetails.roomSize,
        bookingDetails.slots.length
      )
      return res.json({ statusCode: 0, pricing, bookingDetails })
    }
  } catch (e) {
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
  viewCalendar,
  bookRoom,
  editBooking,
  tryBooking,
}
