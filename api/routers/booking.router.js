const express = require('express')

const router = express.Router()

const bookingController = require('../controllers/booking.controller')

const {} = accountController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/register', register)

module.exports = router
