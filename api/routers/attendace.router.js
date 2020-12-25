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
  viewAllMyAttendanceRecord,
  viewAllStaffAttendanceRecord,
} = require('../controllers/attendance.controller')
const {
  verifyToken,
} = require('../helpers/authentication/AuthenticationMiddleWare')
const { verifyUser } = require('../helpers/authentication/authUser')
const { verifyHR } = require('../helpers/authentication/HRAuthentication')
const {
  validateSignInOut,
  validateManualSignInOut,
  validateViewMissingDays,
  validateViewStaffAttendanceRecord,
  validateViewWithMissingDaysHours,
  validateViewAllMyAttendanceRecord,
  validateViewAllStaffAttendanceRecord,
  validateViewMyAttendanceRecord,
} = require('../helpers/validations/attendanceValidations')

router.post('/signIn', validateSignInOut, verifyToken, verifyUser, signIn)
router.post('/signOut', validateSignInOut, verifyToken, verifyUser, signOut)
router.post(
  '/viewMyAttendanceRecord',
  validateViewMyAttendanceRecord,
  verifyToken,
  verifyUser,
  viewMyAttendanceRecord
)
router.post(
  '/viewExtraMissingWorkedHours',
  validateViewMyAttendanceRecord,
  verifyToken,
  verifyUser,
  viewExtraMissingWorkedHours
)
router.post(
  '/viewMissingDays',
  validateViewMissingDays,
  verifyToken,
  verifyUser,
  viewMissingDays
)
router.post(
  '/viewAllMyAttendanceRecord',
  validateViewAllMyAttendanceRecord,
  verifyToken,
  verifyUser,
  viewAllMyAttendanceRecord
)
//hr
router.post(
  '/manualSignIn',
  validateManualSignInOut,
  verifyToken,
  verifyUser,
  verifyHR,
  manualSignIn
)
router.post(
  '/manualSignOut',
  validateManualSignInOut,
  verifyToken,
  verifyUser,
  verifyHR,
  manualSignOut
)

router.post(
  '/viewStaffAttendanceRecord',
  validateViewStaffAttendanceRecord,
  verifyToken,
  verifyUser,
  verifyHR,
  viewStaffAttendanceRecord
)

router.post(
  '/viewStaffWithMissingHours',
  validateViewWithMissingDaysHours,
  verifyToken,
  verifyUser,
  verifyHR,
  viewStaffWithMissingHours
)

router.post(
  '/viewStaffWithMissingDays',
  validateViewWithMissingDaysHours,
  verifyToken,
  verifyUser,
  verifyHR,
  viewStaffWithMissingDays
)

router.post(
  '/viewAllStaffAttendanceRecord',
  validateViewAllStaffAttendanceRecord,
  verifyToken,
  verifyUser,
  verifyHR,
  viewAllStaffAttendanceRecord
)

module.exports = router
