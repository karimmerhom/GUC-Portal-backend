const bcrypt = require('bcrypt')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const validator = require('../helpers/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const cron = require('cron')
const { bookingExpiry } = require('../../config/keys')
const { accountStatus, slotStatus } = require('../constants/TBH.enum')
const VerificationCode = require('../../models/verificationCodes')
const {
  checkFreeSlot,
  checkPrice,
  expireBooking
} = require('../helpers/helpers')
const BookingModel = require('../../models/booking.model')
const CalendarModel = require('../../models/calendar.model')
const PackageModel = require('../../models/package.model')

const validate_booking = async (req, res) => {
  try {
    const isValid = validator.validateAddBooking(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
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

    let slots = []
    slots = Booking.slot
    let slotsThatAreNotFree = []
    for (i = 0; i < slots.length; i++) {
      const helper = await checkFreeSlot(
        slots[i],
        Booking.date,
        Booking.roomNumber
      )
      if (helper.code === errorCodes.slotNotFree) {
        slotsThatAreNotFree.push(slots[i])
      }
    }
    if (slotsThatAreNotFree.length !== 0) {
      return res.json({
        code: errorCodes.slotNotFree,
        error: `These slots are not free: ${slotsThatAreNotFree}`
      })
    }

    const price = await checkPrice(
      Booking.amountOfPeople,
      Booking.roomType,
      slots.length,
      '',
      ''
    )

    if (price.code === errorCodes.peopleOverload) {
      return res.json({
        code: errorCodes.peopleOverload,
        error: 'Number of people is too much for this room type'
      })
    }
    const booking = await BookingModel.create({
      date: Booking.date,
      slot: slots,
      roomType: Booking.roomType,
      roomNumber: Booking.roomNumber,
      amountOfPeople: Booking.amountOfPeople,
      price: price.price,
      paymentMethod: Booking.paymentMethod,
      status: accountStatus.PENDING,
      accountId: Account.id
    })
    const bookingDate = new Date(Booking.date)
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
    for (i = 0; i < slots.length; i++) {
      await CalendarModel.create({
        dayNumber: bookingDate.getDate(),
        month,
        monthNumber: bookingDate.getMonth(),
        year: bookingDate.getFullYear(),
        slot: slots[i],
        status: slotStatus.PENDING,
        date: bookingDate,
        roomNumber: Booking.roomNumber
      })
    }

    return res.json({
      code: errorCodes.success,
      price: price.price,
      bookingId: booking.id
    })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const validate_booking_with_package = async (req, res) => {
  try {
    const isValid = validator.validateBookingWithPackage(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
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
    const booking = await BookingModel.findOne({ where: { id: Booking.id } })
    if (!booking) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Booking not found'
      })
    }
    const price = await checkPrice(
      booking.amountOfPeople,
      booking.roomType,
      booking.slot.length,
      Booking.packageCode,
      Account.id
    )
    if (price.code !== errorCodes.success) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: price.error
      })
    }
    return res.json({ code: errorCodes.success, price: price.price })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const show_all_slots_from_to = async (req, res) => {
  try {
    const isValid = validator.validateShowBookings(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { BookingDate } = req.body
    const dateFrom = new Date(BookingDate.from)
    const dateTo = new Date(BookingDate.to)
    if (dateTo < new Date() || dateFrom < new Date()) {
      return res.json({
        code: errorCodes.dateInThePast,
        error: 'Date cannot be in the past'
      })
    }
    if (dateTo < dateFrom) {
      return res.json({
        code: errorCodes.invalidDateInput,
        error: 'Invalid date input'
      })
    }
    const bookingsFiltered = await CalendarModel.findAll({
      where: {
        date: new Date(BookingDate.date)
      }
    })
    const bookings = bookingsFiltered.map(element => ({
      day: element.dayNumber,
      month: element.month,
      year: element.year,
      slot: element.slot
    }))
    return res.json({
      code: errorCodes.success,
      bookings
    })
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
        error: isValid.error.details[0].message
      })
    }
    const { Booking, Account } = req.body
    const booking = await BookingModel.findOne({
      where: {
        id: Booking.id
      }
    })
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
    if (booking.accountId !== Account.id) {
      return res.json({
        code: errorCodes.unauthorized,
        error: 'Unauthorized access to this booking'
      })
    }
    let slots = []
    slots = booking.slot
    const price = await checkPrice(
      Booking.amountOfPeople,
      Booking.roomType,
      slots.length,
      Booking.packageCode,
      Account.id
    )

    if (price.code === errorCodes.peopleOverload) {
      return res.json({
        code: errorCodes.peopleOverload,
        error: 'Number of people is too much for this room type'
      })
    }

    if (price.remainingHours === 0) {
      await PackageModel.update(
        { remaining: 0, status: accountStatus.USED },
        { where: { code: Booking.packageCode } }
      )
    } else {
      await PackageModel.update(
        { remaining: price.remainingHours },
        { where: { code: Booking.packageCode } }
      )
    }

    await BookingModel.update(
      {
        packageCode: Booking.packageCode,
        price: price.price
      },
      {
        where: {
          id: Booking.id
        }
      }
    )
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
    for (i = 0; i < slots.length; i++) {
      await CalendarModel.update(
        { status: slotStatus.BUSY },
        {
          where: {
            dayNumber: bookingDate.getDate(),
            month,
            monthNumber: bookingDate.getMonth(),
            year: bookingDate.getFullYear(),
            slot: slots[i],
            date: bookingDate,
            roomNumber: booking.roomNumber
          }
        }
      )
    }
    const date = new Date().getTime() + bookingExpiry //Enviroment variable
    const expiryDate = new Date(date)
    const scheduleJob = cron.job(expiryDate, async () => {
      await expireBooking(Booking.id)
    })
    scheduleJob.start()
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const show_my_bookings = async (req, res) => {
  try {
    const isValid = validator.validateShowMyBooking(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account } = req.body
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
    const bookings = await BookingModel.findAll({ where: { accountId: id } })
    const bookingstoShow = bookings.map(element => ({
      date: element.date,
      slot: element.slot,
      period: element.period,
      roomType: element.roomType,
      amountOfPeople: element.amountOfPeople,
      paymentMethod: element.paymentMethod,
      packageCode: element.packageCode,
      status: element.status
    }))
    return res.json({ code: errorCodes.success, bookings: bookingstoShow })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const edit_booking = async (req, res) => {
  try {
    const isValid = validator.validateEditBooking(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
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
        error: 'Cannot edit a canceled booking'
      })
    }
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  validate_booking,
  show_all_slots_from_to,
  confirm_booking,
  show_my_bookings,
  validate_booking_with_package
}
