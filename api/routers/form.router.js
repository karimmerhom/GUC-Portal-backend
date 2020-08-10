const express = require('express')

const router = express.Router()
// const { validateCourse } = require('../helpers/validations/coursesValidations')
const formController = require('../controllers/Organize/Form.controller')

const { createForm } = formController

// const { verifyToken } = require('../../config/AuthenticationMiddleWare')
// const { verifyAdmin } = require('../../config/AdminAuthentication')
// const { verifyUser } = require('../../config/authUser')

router.post('/createForm', createForm)

//router.post('/verify', verifyToken, verify)

module.exports = router
