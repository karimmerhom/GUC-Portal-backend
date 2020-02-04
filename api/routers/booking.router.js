const express = require('express')
const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const { add_booking, confirm_booking } = bookingController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')

router.post('/addbooking', verifyToken, add_booking)
router.post('/confirmbooking', confirm_booking)

module.exports = router
