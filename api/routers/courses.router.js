const express = require('express')

const router = express.Router()
const {
  validateCreate,
  validateEditCourse,
  validateDeleteCourse,
} = require('../helpers/validations/coursesValidations')
const coursesController = require('../controllers/Organize/Courses.controller')

const { createCourse, editCourse, deleteCourse } = coursesController

// const { verifyToken } = require('../../config/AuthenticationMiddleWare')
// const { verifyAdmin } = require('../../config/AdminAuthentication')
// const { verifyUser } = require('../../config/authUser')

router.post('/createCourse', validateCreate, createCourse)
router.post('/editCourse', validateEditCourse, editCourse)
router.post('/deleteCourse', validateDeleteCourse, deleteCourse)

//router.post('/verify', verifyToken, verify)

module.exports = router
