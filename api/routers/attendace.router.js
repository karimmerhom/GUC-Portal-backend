const express = require('express')
const router = express.Router()
const {
  signIn,
  signOut,
  manualSignIn,
  manualSignOut,
  viewMissingDays,
  viewMyAttendanceRecord,
  viewExtraMissingWorkedHours,
} = require('../controllers/attendance.controller')
const {
  validateSignInOut,
  validateManualSignInOut,
  validateViewMissingDays,
} = require('../helpers/validations/attendanceValidations')

router.post('/signIn', validateSignInOut, signIn)
router.post('/signOut', validateSignInOut, signOut)
router.post('/manualSignIn', validateManualSignInOut, manualSignIn)
router.post('/manualSignOut', validateManualSignInOut, manualSignOut)
router.post(
  '/viewMyAttendanceRecord',
  validateViewMissingDays,
  viewMyAttendanceRecord
)
router.post(
  '/viewExtraMissingWorkedHours',
  validateViewMissingDays,
  viewExtraMissingWorkedHours
)

router.post('/viewMissingDays', validateViewMissingDays, viewMissingDays)

module.exports = router
