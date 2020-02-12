const express = require('express')
const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const {
  validate_booking,
  add_booking,
  show_all_slots_from_to,
  show_my_bookings,
  edit_booking
} = bookingController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')

router.post('/validatebooking', verifyToken, validate_booking)
router.post('/addbooking', verifyToken, add_booking)
router.post('/editbooking', verifyAdmin, edit_booking)
router.post('/showcalendar', show_all_slots_from_to)
router.post('/showmybookings', verifyToken, show_my_bookings)

module.exports = router
