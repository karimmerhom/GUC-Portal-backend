const express = require('express')
const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const { add_booking } = bookingController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')

router.post('/addbooking', verifyToken, add_booking)

module.exports = router
