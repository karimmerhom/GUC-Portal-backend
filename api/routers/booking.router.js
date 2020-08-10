const express = require('express')

const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const { viewCalendar } = require('../controllers/booking.controller')

router.post('/viewCalendar', viewCalendar)

module.exports = router
