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
  adminConfirmBooking,
  viewAvailableRooms,
  bookExtremePackage,
  tryEditBooking,
  adminConfirmExtremeBooking,
} = require('../controllers/booking.controller')

const {
  validateViewMyBooking,
  validateCancelBooking,
  validateViewCalendar,
  validateViewDateBookings,
  validateBookRoom,
  validateEditMyBooking,
  validateAdminConfirmBooking,
  validateBookExtremePackage,
  validateAdminConfirmExtremeBooking,
  validateViewAvalaibleRooms,
} = require('../helpers/validations/bookingValidations')

router.post(
  '/bookRoom',
  validateBookRoom,
  verifyToken,
  verifyUser,
  verifiedPhone,
  bookRoom
)
router.post(
  '/tryBooking',
  validateBookRoom,
  verifyToken,
  verifyUser,
  tryBooking
)
router.post(
  '/editBooking',
  validateEditMyBooking,
  verifyToken,
  verifyUser,
  verifiedPhone,
  editBooking
)
router.post(
  '/tryEditBooking',
  validateEditMyBooking,
  verifyToken,
  verifyUser,
  verifiedPhone,
  tryEditBooking
)
router.post(
  '/viewCalendar',
  validateViewCalendar,
  verifyToken,
  verifyUser,
  viewCalendar
)
router.post(
  '/cancelBooking',
  validateCancelBooking,
  verifyToken,
  verifyUser,
  verifiedPhone,
  cancelBooking
)
router.post(
  '/viewMyBookings',
  validateViewMyBooking,
  verifyToken,
  verifyUser,
  verifiedPhone,
  viewMyBookings
)
router.post(
  '/viewDateBookings',
  validateViewDateBookings,
  verifyAdmin,
  viewDateBookings
)
router.post('/viewAllBookings', verifyAdmin, viewAllBookings)
router.post(
  '/viewAvailableRooms',
  validateViewAvalaibleRooms,
  viewAvailableRooms
)

router.post(
  '/adminConfirmExtremeBooking',
  validateAdminConfirmExtremeBooking,
  verifyAdmin,
  adminConfirmExtremeBooking
)

router.post(
  '/adminConfirmBooking',
  validateAdminConfirmBooking,
  verifyAdmin,
  adminConfirmBooking
)

router.post(
  '/bookExtremePackage',
  validateBookExtremePackage,
  bookExtremePackage
)

module.exports = router
