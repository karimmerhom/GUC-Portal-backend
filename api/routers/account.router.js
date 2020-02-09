const express = require('express')
const router = express.Router()

const accountController = require('../controllers/account.controller')

const {
  register,
  login,
  verify,
  change_password,
  change_email,
  change_phone,
  forget_password,
  resend_password,
  confirm_verify
} = accountController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verify)
router.post('/confirmverify', confirm_verify)
router.post('/changePassword', verifyToken, change_password)
router.post('/changeEmail', verifyToken, change_email)
router.post('/changePhone', verifyToken, change_phone)
router.post('/forgetpassword', forget_password)
router.post('/resendpassword', verifyToken, resend_password)

module.exports = router
