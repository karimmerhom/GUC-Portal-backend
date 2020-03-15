const express = require('express')

const router = express.Router()

const eventController = require('../controllers/event.controller')

const {
  create_event_form,
  invite_to_event,
  register_to_event,
  edit_registeration_admin,
  edit_event_admin,
  show_event,
  show_all_events,
  add_collaborator,
  invite_collaborator,
  remove_collaborator,
  // show_all_events_accepted,
  // show_my_events,
  create_event_admin
} = eventController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyUser } = require('../../config/authUser')
const { verifyAdmin } = require('../../config/AdminAuthentication')

router.post('/createEventForm', verifyToken, verifyUser, create_event_form)
router.post('/createEventAdmin', verifyAdmin, create_event_admin)
router.post('/addcollaborator', verifyAdmin, add_collaborator)
router.post('/invitecollaborator', verifyToken, verifyUser, invite_collaborator)
router.post('/removecollaborator', verifyToken, verifyUser, remove_collaborator)
router.post('/invitetoevent', verifyToken, verifyUser, invite_to_event)
router.post('/registerevent', verifyToken, verifyUser, register_to_event)
router.post('/showevent', show_event)
router.post('/showallevents', show_all_events)
// router.post('/showmyevents', verifyToken, verifyUser, show_my_events)
// router.post('/showalleventsaccepted', show_all_events_accepted)
router.post('/editregisterationadmin', verifyAdmin, edit_registeration_admin)
router.post('/editeventadmin', verifyAdmin, edit_event_admin)

module.exports = router
