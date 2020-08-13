const express = require('express')

const router = express.Router()

const formController = require('../controllers/Organize/Form.controller')
const {
  validateCreateForm,
  validateEditForm,
  validateViewForm,
} = require('../helpers/validations/formValidations')

const { createForm, editForm, viewForm, viewAllFormsAdmin } = formController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const { verifiedPhone } = require('../../config/verifiedAuthentication')

router.post(
  '/createForm',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateCreateForm,
  createForm
)
router.post(
  '/editForm',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateEditForm,
  editForm
)
router.post(
  '/viewForm',
  verifyToken,
  verifyUser,
  verifiedPhone,
  validateViewForm,
  viewForm
)
router.post('/viewAllFormsAdmin', verifyAdmin, viewAllFormsAdmin)

//router.post('/verify', verifyToken, verify)

module.exports = router
