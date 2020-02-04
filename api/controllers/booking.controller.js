const bcrypt = require('bcrypt')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const validator = require('../helpers/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const { secretOrKey } = require('../../config/keys')
const { accountStatus, slotStatus } = require('../constants/TBH.enum')
const VerificationCode = require('../../models/verificationCodes')
const { generateOTP } = require('../helpers/helpers')
const BookingModel = require('../../models/booking.model')
const CalendarModel = require('../../models/calendar.model')

const add_booking = async (req, res) => {
  try {
    const isValid = validator.validateAddBooking(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const { Booking, Account } = req.body
    const { id } = req.data
    if (parseInt(id) !== parseInt(Account.id)) {
      return res.json({ code: errorCodes.authentication, error: 'breach' })
    }
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(id)
      }
    })
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    if (account.status === accountStatus.PENDING) {
      return res.json({
        code: errorCodes.unVerified,
        error: 'Account must be verified'
      })
    }
    if (new Date(Booking.date) < new Date()) {
      return res.json({
        code: errorCodes.dateInThePast,
        error: 'Date cannot be in the past'
      })
    }
    await BookingModel.create({
      date: Booking.date,
      slot: Booking.slot,
      period: Booking.period,
      roomType: Booking.roomType,
      amountOfPeople: Booking.amountOfPeople,
      packageCode: Booking.packageCode,
      paymentMethod: Booking.paymentMethod,
      accountId: id,
      dateCreated: new Date(),
      status: accountStatus.PENDING
    })
    res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const show_all_slots_from_to = async (req, res) => {
  try {
    const isValid = validator.validateShowBookings(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const { bookingDate } = req.body
    if (bookingDate.from < new Date()) {
      return res.json({
        code: errorCodes.dateInThePast,
        error: 'Date cannot be in the past'
      })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const confirm_booking = async (req, res) => {
  try {
    const isValid = validator.validateConfirmBooking(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const { Booking } = req.body
    const booking = await BookingModel.findOne({
      where: {
        id: Booking.id
      }
    })
    if (!booking) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Booking not found'
      })
    }
    if (booking.status === accountStatus.CANCELED) {
      return res.json({
        code: errorCodes.bookingCanceled,
        error: 'Cannot confirm a canceled booking'
      })
    }
    const bookingDate = new Date(booking.date)
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const month = months[bookingDate.getMonth()]
    const checkSlot = await CalendarModel.findOne({
      where: {
        slot: booking.slot,
        dayNumber: bookingDate.getDay(),
        month
      }
    })
    if (checkSlot) {
      return res.json({
        code: errorCodes.slotNotFree,
        error: 'Slot is not free'
      })
    }
    await BookingModel.update(
      {
        status: accountStatus.CONFIRMED
      },
      {
        where: {
          id: Booking.id
        }
      }
    )
    await CalendarModel.create({
      dayNumber: bookingDate.getDay(),
      month,
      slot: booking.slot,
      status: slotStatus.BUSY
    })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  add_booking,
  show_all_slots_from_to,
  confirm_booking
}
