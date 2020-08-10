const express = require('express')

const router = express.Router()
// const { validateCourse } = require('../helpers/validations/coursesValidations')
const coursesController = require('../controllers/Organize/Courses.controller')

const { createCourse } = coursesController

// const { verifyToken } = require('../../config/AuthenticationMiddleWare')
// const { verifyAdmin } = require('../../config/AdminAuthentication')
// const { verifyUser } = require('../../config/authUser')

router.post('/createCourse', createCourse)

//router.post('/verify', verifyToken, verify)

module.exports = router
