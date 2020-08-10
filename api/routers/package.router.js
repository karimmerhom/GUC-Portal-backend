const express = require('express')

const router = express.Router()

const packageController = require('../controllers/package.controller')



const {
  createPackage
} = packageController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/register', register)

module.exports = router
