const express = require('express')

const router = express.Router()

const accountController = require('../controllers/account.controller')

const {
  createAccount,
  login,
  firstLogin,
  change_password,
  update_profile,
  get_profile,
  deleteProfile,
} = accountController

const { verifyAC } = require('../helpers/authentication/ACAuthentication')
const { verifyHR } = require('../helpers/authentication/HRAuthentication')

const { verifyCOOR } = require('../helpers/authentication/COORAuthentication')
const { verifyHOD } = require('../helpers/authentication/HODAuthentication')
const { verifyINST } = require('../helpers/authentication/INSTAuthentication ')
const { verifyMEM } = require('../helpers/authentication/MEMAuthentication')

const {
  verifyToken,
} = require('../helpers/authentication/AuthenticationMiddleWare')
const { verifyUser } = require('../helpers/authentication/authUser')

//const { verifyUser } = require('../../config/authUser')

const {
  validateGetProfile,
  validateCreateAccount,
  validateLogin,
  validateFirstLogin,
  validateChangePassword,
  validateUpdateProfile,
  validateDeleteProfile,
} = require('../helpers/validations/accountValidations')

router.post(
  '/createAccount',
  validateCreateAccount,
  verifyToken,
  verifyHR,
  createAccount
)
router.post('/login', validateLogin, login)
router.post('/firstLogin', validateFirstLogin, firstLogin)
router.post(
  '/changePassword',
  validateChangePassword,
  verifyToken,
  verifyUser,
  change_password
)
router.post(
  '/updateprofile',
  validateUpdateProfile,
  verifyToken,
  verifyUser,
  update_profile
)
router.post(
  '/getprofile',
  validateGetProfile,
  verifyToken,
  verifyUser,
  get_profile
)
router.post('/deleteProfile', validateDeleteProfile, verifyHR, deleteProfile)

module.exports = router
