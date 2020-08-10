const express = require('express')

const router = express.Router()
const {
  validateCreate,
  validateViewCourse,
  validateViewAllCourses,
} = require('../helpers/validations/coursesValidations')
const coursesController = require('../controllers/Organize/Courses.controller')

const { viewCourse } = require('../controllers/Organize/Courses.controller')

const { createCourse } = coursesController
const { viewAllCourses } = require('../controllers/Organize/Courses.controller')

// const { verifyToken } = require('../../config/AuthenticationMiddleWare')
// const { verifyAdmin } = require('../../config/AdminAuthentication')
// const { verifyUser } = require('../../config/authUser')

router.post('/createCourse', validateCreate, createCourse)
router.post('/viewCourse', validateViewCourse, viewCourse)
router.post('/viewAllCourses', validateViewAllCourses, viewAllCourses)

//router.post('/verify', verifyToken, verify)

module.exports = router
