const express = require('express')

const router = express.Router()

const eventController = require('../controllers/event.controller')

const { create_event } = eventController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyUser } = require('../../config/authUser')

router.post('/createEvent', verifyToken, verifyUser, create_event)

module.exports = router
