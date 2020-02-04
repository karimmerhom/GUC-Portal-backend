const express = require('express')
const router = express.Router()

const packageController = require('../controllers/package.controller')

const { create_package } = packageController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')

router.post('/addpackage', create_package)

module.exports = router
