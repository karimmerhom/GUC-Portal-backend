const express = require('express')

const router = express.Router()

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

const {
  viewCalendar,
  cancelBooking,
  viewMyBookings,
  viewAllBookings,
  viewDateBookings,
  bookRoom,
  editBooking,
} = require('../controllers/booking.controller')

const {
  validateViewMyBooking,
  validateCancelBooking,
  validateViewCalendar,
  validateViewDateBookings,
  validateBookRoom,
  validateEditMyBooking,
} = require('../helpers/validations/bookingValidations')

router.post('/bookRoom', validateBookRoom, bookRoom)
router.post('/editBooking', validateEditMyBooking, editBooking)

router.post('/viewCalendar', validateViewCalendar, viewCalendar)
router.post('/cancelBooking', validateCancelBooking, cancelBooking)
router.post('/viewMyBookings', validateViewMyBooking, viewMyBookings)
router.post('/viewDateBookings', validateViewDateBookings, viewDateBookings)

router.post('/viewAllBookings', viewAllBookings)

module.exports = router
