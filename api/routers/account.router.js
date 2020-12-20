const express = require('express')

const router = express.Router()

const accountController = require('../controllers/account.controller')

const {
  createAccount,
  login,
  firstLogin,
  change_password,
  // change_email,
  // change_phone,
  // forget_password,
  // confirm_verify,
  update_profile,
  // get_profile,
  // suspend_account,
  // verify_email,
  // verify_confirm_email,
  // register_google,
  // login_google,
  // register_facebook,
  // login_facebook,
  // unlink_google,
  // unlink_facebook,
  // callBackLirtenHub,
  // signUpWithLirtenHub,
  // resend_token,
  // generateUsername,
  // get_profile_number,
} = accountController

//const { verifyToken } = require('../../config/AuthenticationMiddleWare')
//const { verifyAdmin } = require('../../config/AdminAuthentication')
//const { verifyUser } = require('../../config/authUser')

const {
  validateCreateAccount,
  validateLogin,
  validateFirstLogin,
  validateChangePassword,
  validateUpdateProfile,
} = require('../helpers/validations/accountValidations')

router.post('/createAccount', validateCreateAccount, createAccount)
router.post('/login', validateLogin, login)
router.post('/firstLogin', validateFirstLogin, firstLogin)

//router.post('/loginAdmin', validateLogin, login_admin)
//router.post('/verify', validateVerify, verifyToken, verify)
// router.post(
//   '/confirmverify',
//   validateConfirmVerify,
//   verifyToken,
//   confirm_verify
// )
router.post(
  '/changePassword',
  validateChangePassword,
  //verifyToken,
  //verifyUser,
  change_password
)

// router.post('/forgetpassword', validateForgetPassword, forget_password)
router.post(
  '/updateprofile',
  validateUpdateProfile,
  //  verifyToken,
  update_profile
)
// router.post(
//   '/getprofile',
//   validateGetProfile,
//   verifyToken,
//   verifyUser,
//   get_profile
// )
// router.post(
//   '/suspendAccount',
//   validateSuspendAccount,
//   verifyAdmin,
//   suspend_account
// )
// router.post(
//   '/getprofileNumber',
//   validateGetProfileNumber,
//   verifyAdmin,
//   get_profile_number
// )
// router.post('/getgoogleurl', validateCallbackGoogle, urlGoogle) //request url google
// router.post('/getfacebookurl', validateCallbackGoogle, get_url) //request url facebook
// router.post('/facebookcallback', validateCallbackGoogle, facebook_callback)
// router.post('/googlecallback', validateCallbackGoogle, callback)
// router.post('/registergoogle', validateAccountGoogle, register_google)
// router.post('/logingoogle', validateLoginGoogle, login_google)
// router.post(
//   '/unlinkGoogle',
//   validateUnlink,
//   verifyToken,
//   verifyUser,
//   unlink_google
// )
// router.post(
//   '/unlinkFacebook',
//   validateUnlink,
//   verifyToken,
//   verifyUser,
//   unlink_facebook
// )
// router.post('/registerfacebook', validateAccountGoogle, register_facebook)
// router.post('/loginfacebook', validateLoginGoogle, login_facebook)
// router.post(
//   '/verifyemail',
//   validateVerify,
//   verifyToken,
//   verifyUser,
//   verify_email
// )
// router.post(
//   '/confirmverifyemail',
//   validateConfirmVerifyEmail,
//   verify_confirm_email
// )

// router.post('/callBackLirtenHub', validateCallBackLirtenHub, callBackLirtenHub)

// router.post(
//   '/signUpWithLirtenHub',
//   validateSignUpWithLirtenHub,
//   signUpWithLirtenHub
// )

// router.post(
//   '/resendToken',
//   validateResendToken,
//   verifyToken,
//   verifyUser,
//   resend_token
// )

// router.post(
//   '/linkGoogleFacebook',
//   validateLink,
//   verifyToken,
//   verifyUser,
//   link_google_facebook
// )
// router.post('/generateUsername', validateGenerateUsername, generateUsername)

module.exports = router
