const express = require('express')

const router = express.Router()
const {
  validateCreate,
  validateViewCourse,
  validateViewAllCourses,
  validateEditCourse,
  validateDeleteCourse,
  validateViewAllCoursesAdmin,
} = require('../helpers/validations/coursesValidations')
const coursesController = require('../controllers/Organize/Courses.controller')

const {
  viewCourse,
  createCourse,
  viewAllCourses,
  editCourse,
  deleteCourse,
  viewAllCoursesAdmin,
} = coursesController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const { verifiedPhone } = require('../../config/verifiedAuthentication')

router.post(
  '/createCourse',
  validateCreate,
  verifyToken,
  verifyUser,
  verifiedPhone,
  createCourse
)
router.post(
  '/viewCourse',
  validateViewCourse,
  verifyToken,
  verifyUser,
  verifiedPhone,

  viewCourse
)
router.post(
  '/viewAllCourses',
  validateViewAllCourses,
  verifyToken,
  verifyUser,
  verifiedPhone,
  viewAllCourses
)
router.post(
  '/editCourse',
  validateEditCourse,
  verifyToken,
  verifyUser,
  verifiedPhone,

  editCourse
)
router.post(
  '/deleteCourse',
  validateDeleteCourse,
  verifyToken,
  verifyUser,
  verifiedPhone,

  deleteCourse
)

router.post(
  '/viewAllCoursesAdmin',
  validateViewAllCoursesAdmin,
  verifyAdmin,

  viewAllCoursesAdmin
)

// router.post('/verify', verifyToken, verify)

module.exports = router
