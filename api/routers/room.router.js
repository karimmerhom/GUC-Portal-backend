const express = require('express')

const router = express.Router()

const roomController = require('../controllers/room.controller')

const { createRoom, deleteRoom, editRoom, viewRoom } = roomController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/createRoom', verifyAdmin, createRoom)
router.post('/editRoom', verifyAdmin, editRoom)
router.post('/deleteRoom', verifyAdmin, deleteRoom)
router.post('/viewRoom', verifyToken, verifyUser, viewRoom)

module.exports = router
