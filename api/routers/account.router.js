const express = require('express')
const router = express.Router()

// import controller
const accountController = require('../controllers/account.controller')

const { register, login, verify } = accountController

// const { verifyToken } = require('../helpers/authentications/login.auth')
// const { verifyAdmin } = require('../helpers/authentications/admin.auth')

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verify)

module.exports = router
