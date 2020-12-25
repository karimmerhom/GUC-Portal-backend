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
  viewStaffAttendanceRecord,
  viewStaffWithMissingDaysHours,
  viewStaffWithMissingHours,
  viewStaffWithMissingDays,
} = require('../controllers/attendance.controller')
const {
  validateSignInOut,
  validateManualSignInOut,
  validateViewMissingDays,
  validateViewStaffAttendanceRecord,
  validateViewWithMissingDaysHours,
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
router.post(
  '/viewStaffAttendanceRecord',
  validateViewStaffAttendanceRecord,
  viewStaffAttendanceRecord
)
router.post('/viewMissingDays', validateViewMissingDays, viewMissingDays)
router.post(
  '/viewStaffWithMissingHours',
  validateViewWithMissingDaysHours,
  viewStaffWithMissingHours
)
router.post(
  '/viewStaffWithMissingDays',
  validateViewWithMissingDaysHours,
  viewStaffWithMissingDays
)

module.exports = router
