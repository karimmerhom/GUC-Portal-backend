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
  updateSalary,
} = accountController

const { verifyAC } = require('../helpers/authentication/ACAuthentication') // verifies that he is AC
const { verifyHR } = require('../helpers/authentication/HRAuthentication') // verifies that he is HR

const { verifyCOOR } = require('../helpers/authentication/COORAuthentication') //verifies that token is coordinator
const { verifyHOD } = require('../helpers/authentication/HODAuthentication') //verifies that token is HOD
const { verifyINST } = require('../helpers/authentication/INSTAuthentication ') // verifies that token is Instructor
const { verifyMEM } = require('../helpers/authentication/MEMAuthentication') // verifies that token is academic member

const {
  verifyToken,
} = require('../helpers/authentication/AuthenticationMiddleWare') // verifies token helper (needed before verify user)
const { verifyUser } = require('../helpers/authentication/authUser') //verifies that user in token is same as in Account:{}

const {
  validateGetProfile,
  validateCreateAccount,
  validateLogin,
  validateFirstLogin,
  validateChangePassword,
  validateUpdateProfile,
  validateDeleteProfile,
  validateUpdateSalary,
} = require('../helpers/validations/accountValidations')

router.post(
  '/createAccount',
  validateCreateAccount,
  //verifyToken,
  // verifyHR,
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
router.post('/updateSalary', validateUpdateSalary, verifyHR, updateSalary)
router.post('/deleteProfile', validateDeleteProfile, verifyHR, deleteProfile)

module.exports = router
