const express = require('express')

const router = express.Router()

const eventController = require('../controllers/event.controller')

const {
  create_event,
  invite_to_event,
  register_to_event,
  edit_registeration_admin,
  edit_event_admin
} = eventController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyUser } = require('../../config/authUser')
const { verifyAdmin } = require('../../config/AdminAuthentication')

router.post('/createEvent', verifyToken, verifyUser, create_event)
router.post('/invitetoevent', verifyToken, verifyUser, invite_to_event)
router.post('/registerevent', verifyToken, verifyUser, register_to_event)
router.post('/editregisterationadmin', verifyAdmin, edit_registeration_admin)
router.post('/editeventadmin', verifyAdmin, edit_event_admin)

module.exports = router
