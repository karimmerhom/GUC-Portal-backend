const express = require('express')
const router = express.Router()
const {
  viewLeaves,
  requestAnnualLeave,
  requestMaternityLeave,
  requestSickLeave,
  requestAccidentalLeave,
  requestCompensationLeave,
  acceptAccidentalLeave,
  acceptAnnualLeave,
  acceptMaternityLeave,
  acceptSickLeave,
  rejectLeave,
  cancelLeaveReq,
} = require('../controllers/leaves.controller')
const {
  verifyToken,
} = require('../helpers/authentication/AuthenticationMiddleWare')
const { verifyUser } = require('../helpers/authentication/authUser')
const { verifyHOD } = require('../helpers/authentication/HODAuthentication')

const {
  validateViewLeaves,
  validateRequestLeave,
  validateacceptLeave,
  validateCompensationRequestLeave,
} = require('../helpers/validations/leavesValidations')

router.post(
  '/requestAnnualLeave',
  validateRequestLeave,
  verifyToken,
  verifyUser,
  requestAnnualLeave
)
router.post(
  '/requestMaternityLeave',
  validateRequestLeave,
  verifyToken,
  verifyUser,
  requestMaternityLeave
)
router.post(
  '/requestSickLeave',
  validateRequestLeave,
  verifyToken,
  verifyUser,
  requestSickLeave
)
router.post(
  '/requestAccidentalLeave',
  validateRequestLeave,
  verifyToken,
  verifyUser,
  requestAccidentalLeave
)
router.post(
  '/requestCompensationLeave',
  validateCompensationRequestLeave,
  verifyToken,
  verifyUser,
  requestCompensationLeave
)
router.post(
  '/acceptAccidentalLeave',
  validateacceptLeave,
  verifyToken,
  verifyUser,
  verifyHOD,
  acceptAccidentalLeave
)
router.post(
  '/acceptAnnualLeave',
  validateacceptLeave,
  verifyToken,
  verifyUser,
  verifyHOD,
  acceptAnnualLeave
)
router.post(
  '/acceptMaternityLeave',
  validateacceptLeave,
  verifyToken,
  verifyUser,
  verifyHOD,
  acceptMaternityLeave
)
router.post(
  '/acceptSickLeave',
  validateacceptLeave,
  verifyToken,
  verifyUser,
  verifyHOD,
  acceptSickLeave
)
router.post(
  '/rejectLeave',
  validateacceptLeave,
  verifyToken,
  verifyUser,
  verifyHOD,
  rejectLeave
)

router.post(
  '/viewLeaves',
  validateViewLeaves,
  verifyToken,
  verifyUser,
  viewLeaves
)
router.post(
  '/cancelLeaveReq',
  validateacceptLeave,
  verifyToken,
  verifyUser,
  cancelLeaveReq
)

module.exports = router
