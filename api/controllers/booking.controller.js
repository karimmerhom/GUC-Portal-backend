const AccountModel = require('../../models/account.model')
const validator = require('../helpers/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const cron = require('cron')
const { bookingExpiry } = require('../../config/keys')
const {
  accountStatus,
  slotStatus,
  userTypes
} = require('../constants/TBH.enum')
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
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(Account.id)
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
    const dateCheck =
      new Date().setHours(0, 0, 0, 0) -
      new Date(Booking.date).setHours(0, 0, 0, 0)
    if (dateCheck > 0 && req.data.type !== userTypes.ADMIN) {
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
      Booking.packageCode,
      Account.id
    )
    if (price.code !== errorCodes.success) {
      return res.json({
        code: price.code,
        error: price.error
      })
    }

    return res.json({
      code: errorCodes.success,
      price: price.price
    })
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
        error: isValid.error.details[0].message
      })
    }
    const { BookingDate } = req.body
    const dateFrom = new Date(BookingDate.from)
    const dateTo = new Date(BookingDate.to)
    const dateCheck =
      new Date().setHours(0, 0, 0, 0) -
      new Date(BookingDate.from).setHours(0, 0, 0, 0)
    if (dateCheck > 0) {
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
        date: { [Op.between]: [dateFrom, dateTo] }
      }
    })
    const bookings = bookingsFiltered.map(element => ({
      day: element.dayNumber,
      month: element.month,
      year: element.year,
      slot: element.slot,
      status: element.status
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

const add_booking = async (req, res) => {
  try {
    const isValid = validator.validateAddBooking(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Booking, Account } = req.body
    const { id } = Account
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

    const dateCheck =
      new Date().setHours(0, 0, 0, 0) -
      new Date(Booking.date).setHours(0, 0, 0, 0)
    if (dateCheck > 0 && req.data.type !== userTypes.ADMIN) {
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
      Booking.packageCode,
      Account.id
    )
    if (price.code !== errorCodes.success) {
      return res.json({
        code: price.code,
        error: price.error
      })
    }
    let bookingStatus = accountStatus.PENDING
    let statusSlot = slotStatus.PENDING
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
    if (price.price === 0) {
      bookingStatus = accountStatus.CONFIRMED
      statusSlot = slotStatus.BUSY
    }

    const booking = await BookingModel.create({
      date: Booking.date,
      slot: slots,
      roomType: Booking.roomType,
      roomNumber: Booking.roomNumber,
      amountOfPeople: Booking.amountOfPeople,
      price: price.price,
      paymentMethod: Booking.paymentMethod,
      status: bookingStatus,
      accountId: Account.id,
      packageCode: Booking.packageCode
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
        status: statusSlot,
        date: bookingDate,
        roomNumber: Booking.roomNumber
      })
    }
    const date = new Date().getTime() + bookingExpiry //Enviroment variable
    const expiryDate = new Date(date)
    const scheduleJob = cron.job(expiryDate, async () => {
      await expireBooking(booking.id)
    })
    scheduleJob.start()
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
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

    const account = await AccountModel.findOne({
      where: {
        id: parseInt(Account.id)
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
    const bookings = await BookingModel.findAll({
      where: { accountId: parseInt(Account.id) }
    })
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
    const { Booking } = req.body
    // const { id } = req.data
    // if (parseInt(id) !== parseInt(Account.id)) {
    //   return res.json({ code: errorCodes.authentication, error: 'breach' })
    // }
    // const account = await AccountModel.findOne({
    //   where: {
    //     id: parseInt(id)
    //   }
    // })
    // if (!account) {
    //   return res.json({
    //     code: errorCodes.invalidCredentials,
    //     error: 'User not found'
    //   })
    // }
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
    await BookingModel.update(
      { status: Booking.status },
      { where: { id: Booking.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}
const list_all_bookings = async (req, res) => {
  try {
    const allBookings = await BookingModel.findAll()
    return res.json({ code: errorCodes.success, bookings: allBookings })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const booking_details = async (req, res) => {
  try {
    const isValid = validator.validateBookingDetails(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Booking, Account } = req.body
    const found = await BookingModel.findOne({ where: { id: Booking.id } })
    if (!found) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Booking not found'
      })
    }
    if (found.accountId !== Account.id && req.data.type !== userTypes.ADMIN) {
      return res.json({ code: errorCodes.unauthorized, error: 'breach' })
    }
    return res.json({ code: errorCodes.success, booking: found })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const cancel_pending = async (req, res) => {
  try {
    const isValid = validator.validateCancelBooking(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Booking, Account } = req.body

    const booking = await BookingModel.findOne({
      where: {
        id: parseInt(Booking.id)
      }
    })
    if (!booking) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Booking not found'
      })
    }
    if (booking.accountId !== Account.id && req.data.type !== userTypes.ADMIN) {
      return res.json({ code: errorCodes.authentication, error: 'breach' })
    }
    if (booking.status === accountStatus.CONFIRMED) {
      return res.json({
        code: errorCodes.bookingConfirmed,
        error: 'Cannot edit a confirmed booking'
      })
    }
    if (booking.status === accountStatus.CANCELED) {
      return res.json({
        code: errorCodes.bookingCanceled,
        error: 'Cannot edit a canceled booking'
      })
    }
    await expireBooking(Booking.id, accountStatus.CANCELED)
    await BookingModel.update(
      { status: accountStatus.CANCELED },
      { where: { id: Booking.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const edit_timing = async (req, res) => {
  try {
    const isValid = validator.validateEditTiming(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account, Booking } = req.body
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

    if (booking.accountId !== Account.id && req.data.type === userTypes.ADMIN) {
      return res.json({ code: errorCodes.unauthorized, error: 'breach' })
    }

    let addedHrs = []
    let deductedHrs = []
    let i = 0
    booking.slot.forEach(slot => {
      if (!Booking.slot.includes(slot)) {
        deductedHrs.push(slot)
      }
    })
    Booking.slot.forEach(slot => {
      if (!booking.slot.includes(slot)) {
        addedHrs.push(slot)
      }
    })

    let slotsThatAreNotFree = []
    for (i = 0; i < addedHrs.length; i++) {
      const helper = await checkFreeSlot(
        addedHrs[i],
        booking.date,
        booking.roomNumber
      )
      if (helper.code === errorCodes.slotNotFree) {
        slotsThatAreNotFree.push(addedHrs[i])
      }
    }
    if (slotsThatAreNotFree.length !== 0) {
      return res.json({
        code: errorCodes.slotNotFree,
        error: `These slots are not free: ${slotsThatAreNotFree}`
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
    for (i = 0; i < deductedHrs.length; i++) {
      CalendarModel.destroy({
        where: {
          slot: deductedHrs[i],
          date: bookingDate,
          roomNumber: booking.roomNumber
        }
      })
    }
    for (i = 0; i < addedHrs.length; i++) {
      CalendarModel.create({
        dayNumber: bookingDate.getDate(),
        month,
        monthNumber: bookingDate.getMonth(),
        year: bookingDate.getFullYear(),
        slot: addedHrs[i],
        status: slotStatus.PENDING,
        date: bookingDate,
        roomNumber: booking.roomNumber
      })
    }
    const package = (await PackageModel.findOne({
      where: { code: booking.packageCode }
    })) || { remaining: 0, status: accountStatus.USED }
    const addedPrice = addedHrs.length - deductedHrs.length
    let newPrice = booking.price
    console.log('addedPrice:', addedPrice)
    if (addedPrice > 0) {
      console.log('package:', package)
      if (package.status !== accountStatus.USED) {
        if (package.remaining - addedPrice > 0) {
          await PackageModel.update(
            { remaining: package.remaining - addedPrice },
            {
              where: {
                code: booking.packageCode
              }
            }
          )
          console.log('package is active')
          newPrice = 0
        } else {
          await PackageModel.update(
            { remaining: 0, status: accountStatus.USED },
            {
              where: {
                code: booking.packageCode
              }
            }
          )
          console.log('package became used')
          const rate = await checkPrice(
            booking.amountOfPeople,
            booking.roomType,
            -1 * (package.remaining - addedPrice),
            null,
            booking.accountId
          )
          console.log('rate in package used:', rate)
          newPrice = rate.price
          console.log('newPrice:', newPrice)
        }
      } else {
        const rate = await checkPrice(
          booking.amountOfPeople,
          booking.roomType,
          addedPrice,
          null,
          booking.accountId
        )
        console.log('rate when the package in not active', rate)
        newPrice = rate.price + booking.price
        console.log('newPrice', newPrice)
      }
    } else {
      console.log('booking.price:', booking.price)

      if (booking.price > 0) {
        const rate = await checkPrice(
          booking.amountOfPeople,
          booking.roomType,
          addedPrice * -1,
          null,
          booking.accountId
        )
        console.log('rate when addedPrice is negative', rate)
        newPrice = booking.price - rate.price
        console.log('newPrice:', newPrice)
      } else {
        await PackageModel.update(
          {
            remaining: package.remaining - addedPrice,
            status: accountStatus.ACTIVE
          },
          { where: { code: booking.packageCode } }
        )
      }
    }
    let bookingStatus
    if (newPrice > 0) {
      bookingStatus = accountStatus.PENDING
    } else {
      bookingStatus = accountStatus.CONFIRMED
    }

    await BookingModel.update(
      { price: newPrice, slot: Booking.slot, status: bookingStatus },
      { where: { id: booking.id } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  validate_booking,
  show_all_slots_from_to,
  add_booking,
  show_my_bookings,
  edit_booking,
  list_all_bookings,
  booking_details,
  cancel_pending,
  edit_timing
}
