const express = require('express')

const router = express.Router()

const formController = require('../controllers/Organize/Form.controller')
const {
  validateCreateForm,
  validateEditForm,
} = require('../helpers/validations/formValidations')

const { createForm, editForm } = formController

// const { verifyToken } = require('../../config/AuthenticationMiddleWare')
// const { verifyAdmin } = require('../../config/AdminAuthentication')
// const { verifyUser } = require('../../config/authUser')

router.post('/createForm', validateCreateForm, createForm)
router.post('/editForm', validateEditForm, editForm)

//router.post('/verify', verifyToken, verify)

module.exports = router
