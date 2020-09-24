const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const cron = require('cron')
const BookingModel = require('../../models/booking.model')
const CalendarModel = require('../../models/calendar.model')
const RoomModel = require('../../models/room.model')
const pricingModel = require('../../models/pricing.model')
const pendingModel = require('../../models/pending.model')
const expiryModel = require('../../models/expiry.model')
const extremePackageModel = require('../../models/extremePackage.model')
const bookingExtreme = require('../../models/bookingExtreme.model')
const purchasedPackagesModel = require('../../models/purchasedPackages.model')

const moment = require('moment')
const {
  createPurchase,
  expireBooking,
  tryDeductPoints,
} = require('../helpers/helpers')
const validator = require('../helpers/validations/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { Op, where, INTEGER } = require('sequelize')

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
  packageStatus,
  paymentMethods,
  packageType,
  bookingType,
  roomSize,
  roomType,
  slotStatus,
  userTypes,
} = require('../constants/TBH.enum')
const {} = require('../helpers/helpers')
const { object } = require('joi')
const { calendar } = require('googleapis/build/src/apis/calendar')
const Pricing = require('../../models/pricing.model')
const { deductPoints, addPoints } = require('../helpers/helpers')
const { forgotPassword } = require('../constants/errorCodes')

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

    for (i = 0; i < rooms.length; i++) {
      var room = rooms[i]
      var r = {}
      r.roomNumber = room.roomNumber
      r.filtered = false
      r.notFreeSlots = {}
      if (filterRoomSize || filterRoomType) {
        if (filterRoomType) {
          if (room.roomType !== filterRoomType) {
            r.filtered = true
            calendar.push(r)
          }
        }
        if (filterRoomSize) {
          if (room.roomSize !== filterRoomSize) {
            r.filtered = true
            calendar.push(r)
          }
        }
      } else {
        const slots = await CalendarModel.findAll({
          where: {
            roomNumber: r.roomNumber,
            date: new Date(startDate).toDateString(),
          },
        })
        console.log(slots)
        const notslots = slots.map((s) => {
          const sl = {
            slotName: s.slot,
            status: s.status,
            accountId: s.accountId,
            bookingId: s.bookingId,
          }
          return sl
        })

        r.notFreeSlots = notslots

        calendar.push(r)
      }
    }

    return res.json({
      calendar,
      statusCode: errorCodes.success,
      date: new Date(startDate).toDateString(),
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const editBooking = async (req, res) => {
  try {
    if (req.body.date) {
      if (new Date(req.body.date) < new Date()) {
        return res.json({
          error: 'you cannot book in past date',
          statusCode: errorCodes.pastDateBooking,
        })
      }
    }
    const booked = await BookingModel.findOne({
      where: { id: req.body.bookingId },
    })
    if (booked) {
      let bookingDetails = req.body
      bookingDetails.expiryDate = booked.expiryDate
      if (booked.accountId !== parseInt(req.body.Account.id)) {
        return res.json({
          error: 'This is not the users booking',
          statusCode: errorCodes.notUserBooking,
        })
      }
      if (booked.status === bookingStatus.EXPIRED) {
        return res.json({
          statusCode: errorCodes.bookingExpired,
          error: 'The booking has already expired',
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
            date: new Date(bookingDetails.date).toDateString(),
            slot: sl,
          },
        })
        if (notAvSl.length !== 0) noAvailableSlots = true
      }
      if (noAvailableSlots) {
        res.json({
          error: 'one room or more is/are busy in that timeslot',
          statusCode: errorCodes.roomBusy,
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
        return res.json({ statusCode: errorCodes.success })
      }
    } else {
      return res.json({
        statusCode: errorCodes.bookingNotFound,
        error: 'Booking not found',
      })
    }
  } catch (e) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const tryEditBooking = async (req, res) => {
  try {
    if (req.body.date) {
      if (new Date(req.body.date) < new Date()) {
        return res.json({
          error: 'you cannot book in past date',
          statusCode: 7000,
        })
      }
    }
    const booked = await BookingModel.findOne({
      where: { id: req.body.bookingId },
    })
    if (booked) {
      let bookingDetails = req.body
      bookingDetails.expiryDate = booked.expiryDate
      if (
        booked.accountId !== parseInt(req.body.Account.id) &&
        req.data.type !== userTypes.ADMIN
      ) {
        return res.json({
          error: 'This is not the users booking',
          statusCode: errorCodes.notUserBooking,
        })
      }
      if (booked.status === bookingStatus.EXPIRED) {
        return res.json({
          statusCode: errorCodes.bookingExpired,
          error: 'The booking has already expired',
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
            date: new Date(bookingDetails.date).toDateString(),
            slot: sl,
          },
        })
        if (notAvSl.length !== 0) noAvailableSlots = true
      }
      if (noAvailableSlots) {
        return res.json({
          error: 'one room or more is/are busy in that timeslot',
          statusCode: errorCodes.roomBusy,
        })
      } else {
        const pricing = await calculatePrice(
          bookingDetails.roomSize,
          bookingDetails.slots.length
        )
        if (bookingDetails.paymentMethod === paymentMethods.POINTS) {
          const e = await tryDeductPoints(req.body.Account.id, pricing.points)
          console.log(e)
          if (e.statusCode !== errorCodes.success) {
            return res.json({
              error: e.error,
              statusCode: errorCodes.insufficientPoints,
            })
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
            return res.json({
              error: 'You have exceeded the max number of pending orders',
              statusCode: errorCodes.pendingLimitExceeded,
            })
          }
        }
        return res.json({
          statusCode: errorCodes.success,
          bookingDetails,
          pricing,
        })
      }
    } else {
      return res.json({
        statusCode: errorCodes.bookingNotFound,
        error: 'Booking not found',
      })
    }
  } catch (e) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const viewAvailableRooms = async (req, res) => {
  try {
    const startDate = req.body.startDate
    const extremeType = req.body.extremeType

    if (new Date(startDate) < new Date()) {
      return res.json({
        error: 'you cannot book in past date',
        statusCode: errorCodes.pastDateBooking,
      })
    }

    const extreme = await extremePackageModel.findOne({
      where: {
        packageName: extremeType,
      },
    })
    const rooms = await RoomModel.findAll()

    const periodsString = [
      slots.NINE_TEN,
      slots.TEN_ELEVEN,
      slots.ELEVEN_TWELVE,
      slots.TWELVE_THIRTEEN,
      slots.THIRTEEN_FOURTEEN,
      slots.FOURTEEN_FIFTEEN,
      slots.FIFTEEN_SIXTEEN,
      slots.SIXTEEN_SEVENTEEN,
      slots.SEVENTEEN_EIGHTEEN,
      slots.EIGHTEEN_NINETEEN,
      slots.NINETEEN_TWENTY,
      slots.TWENTY_TWENTYONE,
    ]

    let slotsNeeded = []
    console.log(extreme.startPeriod, extreme.endPeriod)
    for (let j = extreme.startPeriod - 9; j < extreme.endPeriod + 2; j++) {
      slotsNeeded.push(periodsString[j])
    }
    console.log(slotsNeeded)

    let availableRooms = []
    for (let j = 0; j < rooms.length; j++) {
      availableRooms.push(rooms[j].roomNumber)
    }

    let i = 0
    var date = new Date(startDate)

    while (i < extreme.daysPerWeek) {
      let dayNumber = date.getDay()
      const calendar = await CalendarModel.findAll({
        where: {
          date: new Date(date).toDateString(),
          slot: { [Op.or]: slotsNeeded },
        },
      })
      console.log(calendar)

      let flag = false
      for (let k = 0; k < calendar.length; k++) {
        availableRooms = availableRooms.filter(
          (room) => calendar[k].roomNumber !== room
        )
      }

      if (dayNumber !== 5) i++
      date.setDate(date.getDate() + 1)
    }
    return res.json({ statusCode: 0, availableRooms })
  } catch (e) {
    console.log(e)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const bookRoom = async (req, res) => {
  try {
    let bookingDetails = req.body
    const status =
      bookingDetails.paymentMethod === 'points' ? 'confirmed' : 'pending'
    bookingDetails.status = status
    if (new Date(bookingDetails.date) < new Date()) {
      return res.json({
        error: 'you cannot book in past date',
        statusCode: errorCodes.pastDateBooking,
      })
    }
    const roomFound = await RoomModel.findOne({
      where: { roomNumber: bookingDetails.roomNumber },
    })

    const pend = await pendingModel.findOne({
      where: { pendingType: 'Bookings' },
    })
    const mybookings = await BookingModel.findAll({
      where: { accountId: req.body.Account.id, status: bookingStatus.PENDING },
    })
    if (mybookings.length >= pend.value) {
      return res.json({
        error: 'you have exceeded the allowed number of pending orders',
        statusCode: errorCodes.pendingLimitExceeded,
      })
    }

    if (!roomFound) {
      return res.json({
        error: 'room doesnt exist',
        statusCode: errorCodes.roomNotFound,
      })
    }

    bookingDetails.roomId = roomFound.id
    bookingDetails.accountId = req.body.Account.id

    let noAvailableSlots = false
    for (let i = 0; i < bookingDetails.slots.length; i++) {
      let sl = bookingDetails.slots[i]
      const notAvSl = await CalendarModel.findAll({
        where: {
          roomNumber: bookingDetails.roomNumber,
          date: new Date(bookingDetails.date).toDateString(),
          slot: sl,
        },
      })
      if (notAvSl.length !== 0) noAvailableSlots = true
    }

    if (noAvailableSlots) {
      return res.json({
        error: 'one room or more is/are busy in that timeslot',
        statusCode: errorCodes.roomBusy,
      })
    } else {
      const pricing = await calculatePrice(
        bookingDetails.roomSize,
        bookingDetails.slots.length
      )
      if (bookingDetails.paymentMethod === paymentMethods.POINTS) {
        const e = await deductPoints(req.body.Account.id, pricing.points)
        if (e.statusCode !== errorCodes.success) {
          console.log(e)
          return res.json({ error: e.error, statusCode: 7000 })
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
            statusCode: errorCodes.pendingLimitExceeded,
          })
        }
      }

      const j = await expiryModel.findOne()

      bookingDetails.expiryDate = expiryDate
      bookingDetails.pricePoints = pricing.points
      bookingDetails.priceCash = pricing.cash
      bookingDetails.date = new Date(bookingDetails.date).toDateString()

      //uncomment this three lines when the model is fixed
      // var expiryDate = new Date().setDate(new Date().getDate() + j.duration)
      // bookingDetails.expiryDate = new Date(expiryDate).toDateString()
      var expiryDate = new Date().setHours(new Date().getHours())
      expiryDate = new Date(expiryDate).setMinutes(
        new Date(expiryDate).getMinutes() + 1
      )
      expiryDate = new Date(expiryDate).setDate(
        new Date(expiryDate).getDate() + 2
      )
      bookingDetails.expiryDate = new Date(expiryDate).toDateString()
      const booked = await BookingModel.create(bookingDetails)
      let text = [
        booked.roomType,
        booked.roomSize,
        moment(booked.date).format('ll'),
        booked.slots.length + ' hours',
      ]

      const c = await createPurchase(
        booked.accountId,
        text,
        parseInt(booked.priceCash)
      )
      if (j.on_off === 'on') {
        const scheduleJob = cron.job(new Date(expiryDate), async () => {
          expireBooking(booked.id)
        })
        scheduleJob.start()
        const scheduleJobDateAlreadyPassed = cron.job(
          new Date(bookingDetails.date),
          async () => {
            expireBooking(booked.id)
          }
        )
        scheduleJobDateAlreadyPassed.start()
      }

      for (let i = 0; i < bookingDetails.slots.length; i++) {
        let sl = bookingDetails.slots[i]

        await CalendarModel.create({
          roomNumber: bookingDetails.roomNumber,
          date: bookingDetails.date,
          status: bookingDetails.status,
          slot: sl,
          bookingId: booked.id,
          accountId: req.body.Account.id,
        })
      }

      return res.json({ statusCode: 0, booked })
    }
  } catch (e) {
    console.log(e)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const tryBooking = async (req, res) => {
  try {
    let bookingDetails = req.body
    const status =
      bookingDetails.paymentMethod === 'points' ? 'confirmed' : 'pending'
    bookingDetails.status = status
    if (new Date(bookingDetails.date) < new Date()) {
      return res.json({
        error: 'you cannot book in past date',
        statusCode: errorCodes.pastDateBooking,
      })
    }
    const roomFound = await RoomModel.findOne({
      where: { roomNumber: bookingDetails.roomNumber },
    })

    const pend = await pendingModel.findOne({
      where: { pendingType: 'Bookings' },
    })
    const mybookings = await BookingModel.findAll({
      where: { accountId: req.body.Account.id, status: bookingStatus.PENDING },
    })
    if (mybookings.length >= pend.value) {
      return res.json({
        error: 'you have exceeded the allowed number of pending orders',
        statusCode: errorCodes.pendingLimitExceeded,
      })
    }
    if (!roomFound) {
      return res.json({
        error: 'room doesnt exist',
        statusCode: errorCodes.roomNotFound,
      })
    }

    bookingDetails.roomId = roomFound.id
    bookingDetails.accountId = req.body.Account.id

    let noAvailableSlots = false
    for (let i = 0; i < bookingDetails.slots.length; i++) {
      let sl = bookingDetails.slots[i]
      const notAvSl = await CalendarModel.findAll({
        where: {
          roomNumber: bookingDetails.roomNumber,
          date: new Date(bookingDetails.date).toDateString(),
          slot: sl,
        },
      })
      if (notAvSl.length !== 0) noAvailableSlots = true
    }

    if (noAvailableSlots) {
      return res.json({
        error: 'one room or more is/are busy in that timeslot',
        statusCode: errorCodes.roomBusy,
      })
    } else {
      const pricing = await calculatePrice(
        bookingDetails.roomSize,
        bookingDetails.slots.length
      )
      if (bookingDetails.paymentMethod === paymentMethods.POINTS) {
        const e = await tryDeductPoints(req.body.Account.id, pricing.points)
        console.log(e)
        if (e.statusCode !== errorCodes.success) {
          return res.json({
            error: e.error,
            statusCode: errorCodes.insufficientPoints,
          })
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
          return res.json({
            error: 'You have exceeded the max number of pending orders',
            statusCode: errorCodes.pendingLimitExceeded,
          })
        }
      }

      const j = await expiryModel.findOne()
      var expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + j.duration)

      bookingDetails.expiryDate = expiryDate
      bookingDetails.pricePoints = pricing.points
      bookingDetails.priceCash = pricing.cash

      return res.json({ statusCode: 0, pricing, bookingDetails })
    }
  } catch (e) {
    console.log(e)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
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
        return res.json({
          statusCode: errorCodes.bookingAlreadyCanceled,
          error: 'booking already canceled',
        })
      }
      if (
        booking.accountId !== accountId &&
        req.data.type !== userTypes.ADMIN
      ) {
        return res.json({
          statusCode: errorCodes.notUserBooking,
          error: 'Not the users booking',
        })
      }

      await BookingModel.update(
        { status: bookingStatus.CANCELED },
        { where: { id: bookingId } }
      )
      await CalendarModel.destroy({
        where: { bookingId: bookingId, bookingType: bookingType.REGULAR },
      })

      return res.json({ statusCode: errorCodes.success })
    } else {
      return res.json({
        statusCode: errorCodes.bookingNotFound,
        error: 'booking not found',
      })
    }
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const viewMyBookings = async (req, res) => {
  try {
    const { Account } = req.body
    id = Account.id
    let booking
    if (req.body.type) {
      booking = await BookingModel.findAll({
        where: {
          accountId: id,
          status: req.body.type,
        },
      })
    } else {
      booking = await BookingModel.findAll({
        where: {
          accountId: id,
        },
      })
    }
    if (booking === []) {
      return res.json({ statusCode: 7000, error: 'No bookings not found' })
    } else {
      return res.json({ booking, statusCode: errorCodes.success })
    }
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const viewBooking = async (req, res) => {
  try {
    const { Account, bookingId } = req.body
    id = Account.id
    let booking
    booking = await BookingModel.findOne({ where: { id: bookingId } })
    if (booking.accountId !== id && req.data.type !== 'admin') {
      return res.json({
        statusCode: errorCodes.unauthorized,
        error: 'This is not your booking',
      })
    }
    return res.json({ booking, statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const viewAllBookings = async (req, res) => {
  try {
    const booking = await BookingModel.findAll()
    return res.json({ booking, statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const viewDateBookings = async (req, res) => {
  try {
    const { date } = req.body

    const booking = await BookingModel.findAll({
      where: {
        date: new Date(date).toDateString(),
      },
    })
    if (booking === []) {
      return res.json({
        statusCode: errorCodes.bookingNotFound,
        error: 'No bookings not found',
      })
    } else {
      return res.json({ booking, statusCode: errorCodes.success })
    }
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const adminConfirmBooking = async (req, res) => {
  try {
    const booked = await BookingModel.findOne({
      where: { id: req.body.bookingId },
    })

    if (booked) {
      if (booked.status === bookingStatus.CANCELED) {
        return res.json({
          statusCode: errorCodes.bookingAlreadyCanceled,
          error: 'booking was canceled',
        })
      }
      if (booked.status === bookingStatus.CONFIRMED) {
        return res.json({
          statusCode: errorCodes.bookingAlreadyConfirmed,
          error: 'booking is already confirmed',
        })
      }
      let text = [
        booked.roomType,
        booked.roomSize,
        moment(booked.date).format('ll'),
        booked.slots.length + ' hours',
      ]

      const c = await createPurchase(
        booked.accountId,
        text,
        parseInt(booked.priceCash)
      )
      await BookingModel.update(
        { status: bookingStatus.CONFIRMED },
        { where: { id: req.body.bookingId } }
      )
      CalendarModel.update(
        { status: bookingStatus.CONFIRMED },
        {
          where: {
            bookingId: req.body.bookingId,
            bookingType: bookingType.REGULAR,
          },
        }
      )
      return res.json({ statusCode: errorCodes.success })
    } else {
      return res.json({
        statusCode: errorCodes.bookingNotFound,
        error: 'Booking not found',
      })
    }
  } catch (e) {
    console.log(e)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const adminConfirmExtremeBooking = async (req, res) => {
  try {
    const booked = await bookingExtreme.findOne({
      where: { id: req.body.bookingId },
    })

    if (booked) {
      if (booked.status === bookingStatus.CANCELED) {
        return res.json({
          statusCode: errorCodes.bookingCanceled,
          error: 'booking was canceled',
        })
      }
      if (booked.status === bookingStatus.CONFIRMED) {
        return res.json({
          statusCode: errorCodes.bookingAlreadyConfirmed,
          error: 'booking is already confirmed',
        })
      }

      let text = [
        booked.roomType,
        booked.roomSize,
        moment(booked.date).format('ll'),
      ]
      const package = await purchasedPackagesModel.findOne({
        where: { id: booked.purchasedId },
      })

      if (package.status === packageStatus.ACTIVE) {
        return res.json({
          statusCode: errorCodes.unknown,
          error: 'package already active',
        })
      }

      const c = await createPurchase(
        booked.accountId,
        text,
        parseInt(booked.price)
      )
      bookingExtreme.update(
        { status: bookingStatus.CONFIRMED },
        { where: { id: req.body.bookingId } }
      )

      purchasedPackagesModel.update(
        { status: packageStatus.ACTIVE },
        { where: { id: booked.purchasedId } }
      )
      CalendarModel.update(
        { status: bookingStatus.CONFIRMED },
        {
          where: {
            bookingId: req.body.bookingId,
            bookingType: bookingType.EXTREME,
          },
        }
      )

      return res.json({ statusCode: errorCodes.success })
    } else {
      return res.json({
        statusCode: errorCodes.bookingNotFound,
        error: 'Booking not found',
      })
    }
  } catch (e) {
    console.log(e)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const bookExtremePackage = async (req, res) => {
  try {
    const packageName = req.body.packageName
    const startDate = req.body.startDate
    const roomNumber = req.body.roomNumber
    if (new Date(startDate) < new Date()) {
      return res.json({
        error: 'you cannot book in past date',
        statusCode: errorCodes.pastDateBooking,
      })
    }
    console.log(startDate, 'here1')
    const aa = await viewAvailableRoomsHelper(new Date(startDate), packageName)
    if (aa.indexOf(roomNumber) === -1) {
      return res.json({
        error: 'This room is not available',
        statusCode: errorCodes.roomNotAvailable,
      })
    }
    const room = await RoomModel.findOne({ where: { roomNumber: roomNumber } })
    const roomSize1 = req.body.roomSize
    const { roomType } = room
    const roomLayout = req.body.roomLayout
    var date = new Date()
    const pack = await extremePackageModel.findOne({
      where: { packageName: packageName },
    })
    let slots = [
      'NINE_TEN',
      'TEN_ELEVEN',
      'ELEVEN_TWELVE',
      'TWELVE_THIRTEEN',
      'THIRTEEN_FOURTEEN',
      'FOURTEEN_FIFTEEN',
      'FIFTEEN_SIXTEEN',
      'SIXTEEN_SEVENTEEN',
      'SEVENTEEN_EIGHTEEN',
      'EIGHTEEN_NINETEEN',
      'NINETEEN_TWENTY',
      'TWENTY_TWENTYONE',
    ]
    const startSlot = pack.startPeriod - 9
    const endSlot = pack.endPeriod + 2

    var d = 0
    console.log(new Date(startDate).toDateString(), 'here')
    const p = await addPoints(
      req.body.Account.id,
      packageType.EXTREME,
      pack.id,
      0,
      roomSize1,
      startDate
    )

    if (p.statusCode === 0) {
      purchaseId = p.purchaseId
    } else {
      return res.json({
        error: 'Cannot purchase new package',
        statusCode: errorCodes.packageCannotBePurchased,
      })
    }
    var endDate = new Date(startDate)
    console.log(endDate)
    for (let i = 0; i < pack.daysPerWeek; i++) {
      if (endDate.getDay() === 5) {
        endDate.setDate(endDate.getDate() + 1)
      }

      endDate.setDate(endDate.getDate() + 1)
    }
    console.log(endDate)
    bookingDetails = {
      startDate: new Date(startDate).toDateString(),
      endDate: new Date(endDate).toDateString(),
      roomType: roomType,
      roomNumber: roomNumber,
      roomSize: roomSize1,
      roomLayout: roomLayout,
      duration: pack.daysPerWeek,
      status: bookingStatus.PENDING,
      purchasedId: p.packageId,
      accountId: req.body.Account.id,
      roomId: room.id,
      price: pack.price,
    }
    if (roomSize1 === roomSize.LARGE) {
      bookingDetails.price = pack.largePrice
    } else {
      bookingDetails.price = pack.smallPrice
    }
    booked = await bookingExtreme.create(bookingDetails)
    d = 0
    date = new Date(startDate)
    for (let i = 0; i < pack.daysPerWeek; i++) {
      if (date.getDay() === 5) {
        date.setDate(date.getDate() + 1)
      }
      for (let j = startSlot; j < endSlot; j++) {
        const x = await CalendarModel.create({
          roomNumber: roomNumber,
          date: new Date(date).toDateString(),
          status: bookingStatus.PENDING,
          slot: slots[j],
          bookingId: booked.id,
          bookingType: bookingType.EXTREME,
          accountId: req.body.Account.id,
        })
      }
      date.setDate(date.getDate() + 1)
    }

    return res.json({ statusCode: errorCodes.success })
  } catch (e) {
    console.log(e)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
const viewAvailableRoomsHelper = async (startDate, extremeType) => {
  const extreme = await extremePackageModel.findOne({
    where: {
      packageName: extremeType,
    },
  })
  const rooms = await RoomModel.findAll()

  const periodsString = [
    slots.NINE_TEN,
    slots.TEN_ELEVEN,
    slots.ELEVEN_TWELVE,
    slots.TWELVE_THIRTEEN,
    slots.THIRTEEN_FOURTEEN,
    slots.FOURTEEN_FIFTEEN,
    slots.FIFTEEN_SIXTEEN,
    slots.SIXTEEN_SEVENTEEN,
    slots.SEVENTEEN_EIGHTEEN,
    slots.EIGHTEEN_NINETEEN,
    slots.NINETEEN_TWENTY,
    slots.TWENTY_TWENTYONE,
  ]

  let slotsNeeded = []

  for (let j = extreme.startPeriod - 9; j < extreme.endPeriod + 2; j++) {
    console.log(periodsString)
    slotsNeeded.push(periodsString[j])
  }

  let availableRooms = []
  for (let j = 0; j < rooms.length; j++) {
    availableRooms.push(rooms[j].roomNumber)
  }

  let i = 0
  var date = new Date(startDate)

  while (i < extreme.daysPerWeek) {
    let dayNumber = date.getDay()

    const calendar = await CalendarModel.findAll({
      where: {
        date: date.toDateString(),
        slot: { [Op.or]: slotsNeeded },
      },
    })

    for (let k = 0; k < calendar.length; k++) {
      availableRooms = availableRooms.filter(
        (room) => calendar[k].roomNumber !== room
      )
    }

    if (dayNumber !== 5) i++
    date.setDate(date.getDate() + 1)
  }
  return availableRooms
}

const viewAvailableRoomsSlots = async (req, res) => {
  try {
    let bookingDetails = req.body

    if (new Date(bookingDetails.date) < new Date()) {
      return res.json({
        error: 'you cannot book in past date',
        statusCode: errorCodes.pastDateBooking,
      })
    }
    const rooms = await RoomModel.findAll()

    var notBusyRooms = []

    for (let i = 0; i < rooms.length; i++) {
      const roomFound = rooms[i]
      bookingDetails.roomId = roomFound.id

      //bookingDetails.accountId = req.body.Account.id

      let noAvailableSlots = false
      for (let i = 0; i < bookingDetails.slots.length; i++) {
        let sl = bookingDetails.slots[i]
        const notAvSl = await CalendarModel.findAll({
          where: {
            roomNumber: roomFound.roomNumber,
            date: new Date(bookingDetails.date).toDateString(),
            slot: sl,
          },
        })
        if (notAvSl.length !== 0) noAvailableSlots = true
      }
      if (noAvailableSlots) {
      } else {
        notBusyRooms.push(rooms[i].roomNumber)
      }
    }

    if (notBusyRooms.length === 0) {
      return res.json({
        statusCode: errorCodes.noAvailableRoomSlots,
        error: 'no available rooms in this slot',
      })
    } else {
      return res.json({ statusCode: 0, notBusyRooms })
    }
  } catch (e) {
    console.log(e)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

module.exports = {
  viewAvailableRoomsSlots,
  adminConfirmExtremeBooking,
  bookExtremePackage,
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
  viewAvailableRooms,
  tryEditBooking,
  viewBooking,
}
