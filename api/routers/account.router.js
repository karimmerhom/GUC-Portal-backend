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
  confirm_verify,
  update_profile,
  get_profile
} = accountController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verifyToken, verify)
router.post('/confirmverify', verifyToken, confirm_verify)
router.post('/changePassword', verifyToken, change_password)
router.post('/changeEmail', verifyToken, change_email)
router.post('/changePhone', verifyToken, change_phone)
router.post('/forgetpassword', forget_password)
router.post('/resendpassword', verifyToken, resend_password)
router.post('/updateprofile', verifyToken, update_profile)
router.post('/getprofile', verifyToken, get_profile)

module.exports = router
