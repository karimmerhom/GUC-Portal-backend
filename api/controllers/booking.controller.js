const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const BookingModel = require('../../models/booking.model')
const CalendarModel = require('../../models/calendar.model')
const RoomModel = require('../../models/room.model')
const pricingModel = require('../../models/pricing.model')
const pendingModel = require('../../models/pending.model')
const expiryModel = require('../../models/expiry.model')

const validator = require('../helpers/validations/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { Op, where } = require('sequelize')

const {
  secretOrKey,
  smsAccessKey,
  contactAccessKey,
  emailAccessKey,
} = require('../../config/keys')
const {
  slots,
  calStatus,
  bookingStatus,
  paymentMethods,
} = require('../constants/TBH.enum')
const {} = require('../helpers/helpers')
const { object } = require('joi')
const { calendar } = require('googleapis/build/src/apis/calendar')
const Pricing = require('../../models/pricing.model')
const { deductPoints, addPoints } = require('../helpers/helpers')

const calculatePrice = async (type, slots) => {
  try {
    var pricing = {}
    pricing.points = 0
    pricing.cash = 0

    const pricingfound = await pricingModel.findOne({
      where: { pricingType: 'flat_rate', roomType: type },
    })
    pricing.cash = pricingfound.value * slots

    const pricingfound1 = await pricingModel.findOne({
      where: { pricingType: 'points', roomType: type },
    })

    pricing.points = pricingfound1.value * slots

    return pricing
  } catch (exception) {
    return console.log('calculation error')
  }
}

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
      if (booked.accountId !== parseInt(req.body.Account.id)) {
        res.json({
          error: 'This is not the users booking',
          statusCode: 7000,
        })
      }

      const status =
        bookingDetails.paymentMethod === 'points' ? 'confirmed' : 'pending'
      bookingDetails.status = status

      let noAvailableSlots = false
      for (let i = 0; i < bookingDetails.slots.length; i++) {
        let sl = bookingDetails.slots[i]
        const notAvSl = await CalendarModel.findAll({
          where: {
            bookingId: { [Op.not]: req.body.bookingId },
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

    if (noAvailableSlots) {
      res.json({
        error: 'one room or more is/are busy in that timeslot',
        statusCode: 7000,
      })
    } else {
      const pricing = await calculatePrice(
        bookingDetails.roomSize,
        bookingDetails.slots.length
      )
      if (bookingDetails.paymentMethod === paymentMethods.POINTS) {
        const e = await deductPoints(pricing.points, req.body.Account.id)
        console.log(e)
        if (e.error !== 'success') {
          res.json({ error: e.error, statusCode: 7000 })
        }
      } else {
        const p = await pendingModel.findOne({
          where: { pendingType: 'Bookings' },
        })

        const oldbookings = await BookingModel.findAll({
          where: {
            accountId: req.body.Account.id,
            status: bookingStatus.PENDING,
          },
        })
        if (oldbookings.length === p.value) {
          res.json({
            error: 'You have exceeded the max number of pending orders',
            statusCode: 7000,
          })
        }
      }

      const j = await expiryModel.findOne()
      var expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + j.duration)

      // bookingDetails.expiryDate=expiryDate
      // bookingDetails.pricePoints= pricing.points
      // bookingDetails.priceCash = pricing.cash
      //uncomment this three lines when the model is fixed

      const booked = await BookingModel.create(bookingDetails)
      for (let i = 0; i < bookingDetails.slots.length; i++) {
        let sl = bookingDetails.slots[i]

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

    if (noAvailableSlots) {
      res.json({
        error: 'one room or more is/are busy in that timeslot',
        statusCode: 7000,
      })
    } else {
      const pricing = await calculatePrice(
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
    console.log(exception.message)
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

const adminConfirmBooking = async (req, res) => {
  try {
    const booked = await BookingModel.findOne({
      where: { id: req.body.bookingId },
    })

    if (booked) {
      if (booked.status === bookingStatus.CANCELED) {
        return res.json({ statusCode: 7000, error: 'booking was canceled' })
      }
      if (booked.status === bookingStatus.CONFIRMED) {
        return res.json({
          statusCode: 7000,
          error: 'booking is already confirmed',
        })
      }

      await BookingModel.update(
        { status: bookingStatus.CONFIRMED },
        { where: { id: req.body.bookingId } }
      )
      return res.json({ code: errorCodes.success })
    } else {
      return res.json({ code: errorCodes.unknown, error: 'Booking not found' })
    }
  } catch (e) {
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
  adminConfirmBooking,
}