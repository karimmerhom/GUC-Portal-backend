const express = require('express')

const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const { viewCalendar, bookRoom } = require('../controllers/booking.controller')

router.post('/viewCalendar', viewCalendar)
router.post('/bookRoom', bookRoom)

module.exports = router
