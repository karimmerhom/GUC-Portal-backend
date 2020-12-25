const express = require('express')
const router = express.Router()
const {
  requestChangeDayOff,
  updateRequest,
  viewSentReq,
  viewAllRequests
} = require('../controllers/changeDayOff.controller')
const { verifyAC } = require('../helpers/authentication/ACAuthentication')
const {
  verifyToken,
} = require('../helpers/authentication/AuthenticationMiddleWare')
const { verifyUser } = require('../helpers/authentication/authUser')
const { verifyHOD } = require('../helpers/authentication/HODAuthentication')
const {
  validateRequestChangeDayOff,
  validateUpdateRequest,
  validateViewSentReq,
  
} = require('../helpers/validations/changeDayOffValidations')

router.post(
  '/requestChangeDayOff',
  validateRequestChangeDayOff,
  verifyToken,
  verifyUser,
  verifyAC,
  requestChangeDayOff
)
router.post(
  '/updateRequest',
  validateUpdateRequest,
  verifyToken,
  verifyUser,
  verifyHOD,
  updateRequest
)
router.post(
  '/viewSentReq',
  validateViewSentReq,
  verifyToken,
  verifyUser,
  verifyHOD,
  viewSentReq
)
router.post(
  '/viewAllRequests',
  validateViewSentReq,
  // verifyToken,
  // verifyUser,
  // verifyHOD,
  viewAllRequests
)
module.exports = router
