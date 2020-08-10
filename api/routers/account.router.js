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

const {
  validateAccount,
  validateLogin,
  validateVerify,
  validateConfirmVerify,
  validateChangeEmail,
  validateChangePassword,
  validateChangePhone,
  validateForgetPassword,
  validateUpdateProfile,
  validateGetProfile,
  validateSuspendAccount,
  validateAccountGoogle,
  validateLoginGoogle,
  validateConfirmVerifyEmail,
} = require('../helpers/validations/accountValidations')

router.post('/register', validateAccount, register)
router.post('/login', validateLogin, login)
router.post('/verify', validateVerify, verifyToken, verify)
router.post(
  '/confirmverify',
  validateConfirmVerify,
  verifyToken,
  confirm_verify
)
router.post(
  '/changePassword',
  validateChangePassword,
  verifyToken,
  verifyUser,
  change_password
)
router.post(
  '/changeEmail',
  validateChangeEmail,
  verifyToken,
  verifyUser,
  change_email
)
router.post(
  '/changePhone',
  validateChangePhone,
  verifyToken,
  verifyUser,
  change_phone
)
router.post('/forgetpassword', validateForgetPassword, forget_password)
router.post(
  '/updateprofile',
  validateUpdateProfile,
  verifyToken,
  update_profile
)
router.post(
  '/getprofile',
  validateGetProfile,
  verifyToken,
  verifyUser,
  get_profile
)
router.post(
  '/suspendAccount',
  validateSuspendAccount,
  verifyAdmin,
  suspend_account
)
// router.post('/getgoogleurl', urlGoogle) //request url google
// router.post('/getfacebookurl', get_url) //request url facebook
// router.post('/facebookcallback', facebook_callback)
// router.post('/googlecallback', callback)
router.post('/registergoogle', validateAccountGoogle, register_google)
router.post('/logingoogle', validateLoginGoogle, login_google)
router.post('/registerfacebook', validateAccountGoogle, register_facebook)
router.post('/loginfacebook', validateLoginGoogle, login_facebook)
router.post(
  '/verifyemail',
  validateVerify,
  verifyToken,
  verifyUser,
  verify_email
)
router.post(
  '/confirmverifyemail',
  validateConfirmVerifyEmail,
  verify_confirm_email
)

module.exports = router
