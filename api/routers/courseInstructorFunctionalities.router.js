const express = require('express')
const router = express.Router()
const {
  viewMyCoursesCoverage,
  viewMyCoursesAssignment,
  viewStaff,
} = require('../controllers/courseInstructorFunctionalities.controller')
const {
  validateViewMyCoursesCoverage,
  validateViewStaff,
} = require('../helpers/validations/courseInstructorFunctionalitiesValidations')

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
  '/viewMyCoursesCoverage',
  validateViewMyCoursesCoverage,
  verifyToken,
  verifyUser,
  verifyINST,
  viewMyCoursesCoverage
)
router.post(
  '/viewMyCoursesAssignment',
  validateViewMyCoursesCoverage,
  verifyToken,
  verifyUser,
  verifyINST,
  viewMyCoursesAssignment
)
router.post(
  '/viewStaff',
  validateViewStaff,
  verifyToken,
  verifyUser,
  verifyINST,
  viewStaff
)
module.exports = router
