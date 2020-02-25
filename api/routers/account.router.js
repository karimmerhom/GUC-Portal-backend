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
  get_profile,
  suspend_account,
  unsuspend_account,
  get_accounts,
  verify_email,
  verify_confirm_email
} = accountController

const {
  get_url,
  facebook_callback
} = require('../controllers/facebook/callback')

const { urlGoogle, callback } = require('../controllers/google/callback')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verifyToken, verify)
router.post('/confirmverify', verifyToken, confirm_verify)
router.post('/changePassword', verifyToken, verifyUser, change_password)
router.post('/changeEmail', verifyToken, verifyUser, change_email)
router.post('/changePhone', verifyToken, verifyUser, change_phone)
router.post('/forgetpassword', forget_password)
router.post('/resendpassword', verifyToken, resend_password)
router.post('/updateprofile', verifyToken, update_profile)
router.post('/getprofile', verifyToken, verifyUser, get_profile)
router.post('/suspendAccount', verifyAdmin, suspend_account)
router.post('/unsuspendAccount', verifyAdmin, unsuspend_account)
router.post('/getAccounts', verifyAdmin, get_accounts)
router.get('/googlelogin', urlGoogle)
router.get('/facebooklogin', get_url)
router.get('/facebookcallback', facebook_callback)
router.get('/googlecallback', callback)
router.post('/verifyemail', verifyToken, verifyUser, verify_email)
router.get('/confirmverifyemail:verificationCode', verify_confirm_email)

module.exports = router
