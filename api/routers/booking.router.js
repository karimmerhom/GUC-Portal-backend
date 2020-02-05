const express = require('express')
const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const {
  add_booking,
  confirm_booking,
  show_all_slots_from_to,
  show_my_bookings
} = bookingController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')

router.post('/addbooking', verifyToken, add_booking)
router.post('/confirmbooking', confirm_booking)
router.post('/showcalendar', show_all_slots_from_to)
router.post('/showmybookings', verifyToken, show_my_bookings)

module.exports = router
