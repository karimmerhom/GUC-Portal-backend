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
  validateViewLeaves,
  validateRequestLeave,
  validateacceptLeave,
  validateCompensationRequestLeave,
} = require('../helpers/validations/leavesValidations')

router.post('/requestAnnualLeave', validateRequestLeave, requestAnnualLeave)
router.post(
  '/requestMaternityLeave',
  validateRequestLeave,
  requestMaternityLeave
)
router.post('/requestSickLeave', validateRequestLeave, requestSickLeave)
router.post(
  '/requestAccidentalLeave',
  validateRequestLeave,
  requestAccidentalLeave
)
router.post(
  '/requestCompensationLeave',
  validateCompensationRequestLeave,
  requestCompensationLeave
)
router.post(
  '/acceptAccidentalLeave',
  validateacceptLeave,
  acceptAccidentalLeave
)
router.post('/acceptAnnualLeave', validateacceptLeave, acceptAnnualLeave)
router.post('/acceptMaternityLeave', validateacceptLeave, acceptMaternityLeave)
router.post('/acceptSickLeave', validateacceptLeave, acceptSickLeave)
router.post('/rejectLeave', validateacceptLeave, rejectLeave)
router.post('/viewLeaves', validateViewLeaves, viewLeaves)
router.post('/cancelLeaveReq', validateacceptLeave, cancelLeaveReq)

module.exports = router
