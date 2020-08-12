const express = require('express')

const router = express.Router()
const { verifiedPhone } = require('../../config/verifiedAuthentication')

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
  tryBooking,
} = require('../controllers/booking.controller')

const {
  validateViewMyBooking,
  validateCancelBooking,
  validateViewCalendar,
  validateViewDateBookings,
  validateBookRoom,
  validateEditMyBooking,
} = require('../helpers/validations/bookingValidations')

router.post(
  '/bookRoom',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateBookRoom,
  bookRoom
)
router.post(
  '/tryBooking',
  verifyToken,
  verifyUser,
  validateBookRoom,
  tryBooking
)
router.post(
  '/editBooking',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateEditMyBooking,
  editBooking
)
router.post(
  '/viewCalendar',
  verifyToken,
  verifyUser,
  validateViewCalendar,
  viewCalendar
)
router.post(
  '/cancelBooking',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateCancelBooking,
  cancelBooking
)
router.post(
  '/viewMyBookings',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateViewMyBooking,
  viewMyBookings
)
router.post(
  '/viewDateBookings',
  verifyAdmin,
  validateViewDateBookings,
  viewDateBookings
)
router.post('/viewAllBookings', verifyAdmin, viewAllBookings)

module.exports = router
