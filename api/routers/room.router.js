const express = require('express')

const router = express.Router()

const roomController = require('../controllers/room.controller')

const { createRoom, deleteRoom, editRoom, viewRoom } = roomController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/createRoom', createRoom)
router.post('/editRoom', editRoom)
router.post('/deleteRoom', deleteRoom)
router.post('/viewRoom', viewRoom)

module.exports = router
