const express = require('express')

const router = express.Router()
const {
  validateCreate,
  validateViewAllCourses,
  validateViewCourse
} = require('../helpers/validations/confirmedCoursesValidations')
const coursesController = require('../controllers/Organize/ConfirmedCourses.controller')

const {
 
  createCourse,
  viewAllCourses,
  viewCourse
 
} = coursesController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const { verifiedPhone } = require('../../config/verifiedAuthentication')

router.post(
  '/createCourse',
  validateCreate,
  createCourse
)
router.post(
  '/viewAllCourses',
  validateViewAllCourses,
  viewAllCourses
)
router.post(
  '/viewCourse',
  validateViewCourse,
  viewCourse
)
module.exports = router
