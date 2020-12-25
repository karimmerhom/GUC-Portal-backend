const express = require('express')
const router = express.Router()
const {
  viewStaff,
  viewDaysOff,
  viewCoursesCoverage,
  viewTeachingAssignments,
} = require('../controllers/hodFunctionalities.controller')
const {
  validateViewStaff,
  validateViewDaysOff,
  validateViewCoursesCoverage,
  validateViewTeachingAssignments,
} = require('../helpers/validations/hodFunctionalitiesValidations')

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
  '/viewStaff',
  validateViewStaff,
  verifyToken,
  verifyUser,
  verifyHOD,
  viewStaff
)
router.post(
  '/viewDaysOff',
  validateViewDaysOff,
  verifyToken,
  verifyUser,
  verifyHOD,
  viewDaysOff
)
router.post(
  '/viewCoursesCoverage',
  validateViewCoursesCoverage,
  verifyToken,
  verifyUser,
  verifyHOD,
  viewCoursesCoverage
)
router.post(
  '/viewTeachingAssignments',
  validateViewTeachingAssignments,
  verifyToken,
  verifyUser,
  verifyHOD,
  viewTeachingAssignments
)

module.exports = router
