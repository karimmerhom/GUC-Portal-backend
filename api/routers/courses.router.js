const express = require('express')

const router = express.Router()
const {
  validateCreate,
  validateViewCourse,
  validateViewAllCourses,
  validateEditCourse,
  validateDeleteCourse,
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
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateCreate,
  createCourse
)
router.post(
  '/viewCourse',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateViewCourse,
  viewCourse
)
router.post(
  '/viewAllCourses',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateViewAllCourses,
  viewAllCourses
)
router.post(
  '/editCourse',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateEditCourse,
  editCourse
)
router.post(
  '/deleteCourse',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateDeleteCourse,
  deleteCourse
)

router.post('/viewAllCoursesAdmin', verifyAdmin, viewAllCoursesAdmin)

// router.post('/verify', verifyToken, verify)

module.exports = router
