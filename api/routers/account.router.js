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
  confirm_verify,
  update_profile,
  get_profile,
  suspend_account,
  unsuspend_account,
  get_accounts,
  verify_email,
  verify_confirm_email,
  register_google,
  login_google,
  register_facebook,
  login_facebook,
} = accountController

// const {
//   get_url,
//   facebook_callback,
// } = require('../controllers/facebook/callback')

// const { urlGoogle, callback } = require('../controllers/google/callback')

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
router.post('/updateprofile', verifyToken, update_profile)
router.post('/getprofile', verifyToken, verifyUser, get_profile)
router.post('/suspendAccount', verifyAdmin, suspend_account)
router.post('/unsuspendAccount', verifyAdmin, unsuspend_account)
router.post('/getAccounts', verifyAdmin, get_accounts)
// router.post('/getgoogleurl', urlGoogle) //request url google
// router.post('/getfacebookurl', get_url) //request url facebook
// router.post('/facebookcallback', facebook_callback)
// router.post('/googlecallback', callback)
router.post('/registergoogle', register_google)
router.post('/logingoogle', login_google)
router.post('/registerfacebook', register_facebook)
router.post('/loginfacebook', login_facebook)
router.post('/verifyemail', verifyToken, verifyUser, verify_email)
router.get('/confirmverifyemail', verify_confirm_email)

module.exports = router
