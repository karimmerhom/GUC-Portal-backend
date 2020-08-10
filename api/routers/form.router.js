const express = require('express')

const router = express.Router()

const formController = require('../controllers/Organize/Form.controller')
const { validateCreateForm } = require('../helpers/validations/formValidations')

const { createForm } = formController

// const { verifyToken } = require('../../config/AuthenticationMiddleWare')
// const { verifyAdmin } = require('../../config/AdminAuthentication')
// const { verifyUser } = require('../../config/authUser')

router.post('/createForm', validateCreateForm, createForm)

//router.post('/verify', verifyToken, verify)

module.exports = router
