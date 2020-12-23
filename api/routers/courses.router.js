const express = require('express')
const router = express.Router()
const {
  createCourse,
  updateCourse,
  deleteCourse,
  assignCourseInstructor,
  assignCourseMember,
  assignCourseCoordinator,
  unassignCourse,
  updateCourseInstructor,
} = require('../controllers/courses.controller')
const {
  validateCreateCourse,
  validateUpdateCourse,
  validateDeleteCourse,
  validateAssign,
} = require('../helpers/validations/coursesValidations')

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

router.post('/createCourse', validateCreateCourse, createCourse)

router.post('/updateCourse', validateUpdateCourse, updateCourse)

router.post('/deleteCourse', validateDeleteCourse, deleteCourse)

router.post(
  '/assignCourseInstructor',
  verifyToken,
  verifyUser,
  verifyHOD,
  validateAssign,
  assignCourseInstructor
)

router.post(
  '/updateCourseInstructor',
  verifyToken,
  verifyUser,
  verifyHOD,
  validateAssign,
  updateCourseInstructor
)

router.post(
  '/assignCourseCoordinator',
  verifyToken,
  verifyUser,
  verifyINST,
  validateAssign,
  assignCourseCoordinator
)

router.post(
  '/assignCourseMember',
  verifyToken,
  verifyUser,
  verifyHOD,
  validateAssign,
  assignCourseMember
)

router.post(
  '/unassignCourse',
  verifyToken,
  verifyUser,
  verifyHOD,
  validateAssign,
  unassignCourse
)

module.exports = router
