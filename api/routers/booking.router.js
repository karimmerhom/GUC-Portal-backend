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
<<<<<<< HEAD
  bookExtremePackage,
=======
  tryEditBooking,
>>>>>>> f2800bd77fefa62a47380999da7c16681240d8c4
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
  // verifyToken,
  // verifyUser,
  // verifiedPhone,
  validateEditMyBooking,
  editBooking
)
router.post(
  '/tryEditBooking',
  // verifyToken,
  // verifyUser,
  // verifiedPhone,
  validateEditMyBooking,
  tryEditBooking
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
router.post('/viewAvailableRooms', viewAvailableRooms)

router.post(
  '/adminConfirmBooking',
  // verifyAdmin,
  validateAdminConfirmBooking,
  adminConfirmBooking
)

router.post(
  '/bookExtremePackage',
  validateBookExtremePackage,
  bookExtremePackage
)

module.exports = router
