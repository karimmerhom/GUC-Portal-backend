const express = require('express')
const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const {
  validate_booking,
  validate_booking_with_package,
  confirm_booking,
  show_all_slots_from_to,
  show_my_bookings
} = bookingController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')

router.post('/addbooking', verifyToken, validate_booking)
router.post('/recalculatebooking', verifyToken, validate_booking_with_package)
router.post('/confirmbooking', verifyToken, confirm_booking)
router.post('/showcalendar', show_all_slots_from_to)
router.post('/showmybookings', verifyToken, show_my_bookings)

module.exports = router
