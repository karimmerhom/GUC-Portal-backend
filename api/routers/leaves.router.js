const express = require('express')
const router = express.Router()
const {
  requestAnnualLeave,
  requestMaternityLeave,
  requestSickLeave,
  requestAccidentalLeave,
  requestCompensationLeave,
  acceptAccidentalLeave,
  acceptAnnualLeave,
  acceptMaternityLeave,
  acceptSickLeave,
} = require('../controllers/leaves.controller')

const {
  validateRequestLeave,
  validateacceptLeave,
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
  validateRequestLeave,
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

module.exports = router
