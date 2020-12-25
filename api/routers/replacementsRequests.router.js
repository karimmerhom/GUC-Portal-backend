const express = require('express')
const router = express.Router()
const {
  createReplacementRequest,
  updateReplacementRequestStatus,
  viewRecievedReq,
  viewSentReq,
} = require('../controllers/replacementsRequests.controller')
const {
  validateCreateReplacementRequest,
  validateUpdateReplacementRequestStatus,
  validateViewRecievedReq,
} = require('../helpers/validations/replacementsRequestsValidations')

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

router.post(
  '/createReplacementRequest',
  validateCreateReplacementRequest,
  verifyToken,
  verifyUser,
  verifyMEM,
  createReplacementRequest
)
router.post(
  '/updateReplacementRequestStatus',
  validateUpdateReplacementRequestStatus,
  verifyToken,
  verifyUser,
  verifyMEM,
  updateReplacementRequestStatus
)
router.post(
  '/viewRecievedReq',
  validateViewRecievedReq,
  verifyToken,
  verifyUser,
  verifyMEM,
  viewRecievedReq
)
router.post(
  '/viewSentReq',
  validateViewRecievedReq,
  verifyToken,
  verifyUser,
  verifyMEM,
  viewSentReq
)
module.exports = router
