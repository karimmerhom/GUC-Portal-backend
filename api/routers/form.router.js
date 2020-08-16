const express = require('express')

const router = express.Router()

const formController = require('../controllers/Organize/Form.controller')
const {
  validateCreateForm,
  validateEditForm,
  validateViewForm,
  validateViewAllFormsAdmin,
} = require('../helpers/validations/formValidations')

const { createForm, editForm, viewForm, viewAllFormsAdmin } = formController

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const { verifiedPhone } = require('../../config/verifiedAuthentication')

router.post(
  '/createForm',
  validateCreateForm,
  verifyToken,
  verifyUser,
  verifiedPhone,

  createForm
)
router.post(
  '/editForm',
  validateEditForm,
  verifyToken,
  verifyUser,
  verifiedPhone,

  editForm
)
router.post(
  '/viewForm',
  validateViewForm,
  verifyToken,
  verifyUser,
  verifiedPhone,
  viewForm
)
router.post(
  '/viewAllFormsAdmin',
  validateViewAllFormsAdmin,
  verifyAdmin,
  viewAllFormsAdmin
)

//router.post('/verify', verifyToken, verify)

module.exports = router
