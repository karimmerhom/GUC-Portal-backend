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
} = require('../controllers/booking.controller')

const {
  validateViewMyBooking,
  validateCancelBooking,
  validateViewCalendar,
  validateViewDateBookings,
} = require('../helpers/validations/bookingValidations')

router.post('/viewCalendar', validateViewCalendar, viewCalendar)
router.post('/cancelBooking', validateCancelBooking, cancelBooking)
router.post('/viewMyBookings', validateViewMyBooking, viewMyBookings)
router.post('/viewDateBookings', validateViewDateBookings, viewDateBookings)
router.post('/viewAllBookings', viewAllBookings)

module.exports = router
