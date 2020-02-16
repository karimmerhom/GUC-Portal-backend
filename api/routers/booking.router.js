const express = require('express')
const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const {
  validate_booking,
  add_booking,
  show_all_slots_from_to,
  show_my_bookings,
  edit_booking,
  list_all_bookings,
  booking_details,
  cancel_pending
} = bookingController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/validatebooking', verifyToken, validate_booking)
router.post('/addbooking', verifyToken, verifyUser, add_booking)
router.post('/editbooking', verifyAdmin, edit_booking)
router.post('/showcalendar', show_all_slots_from_to)
router.post('/showmybookings', verifyToken, show_my_bookings)
router.post('/listallbookings', verifyAdmin, list_all_bookings)
router.post('/bookingdetails', verifyToken, verifyUser, booking_details)
router.post('/cancelpending', verifyToken, verifyUser, cancel_pending)

module.exports = router
