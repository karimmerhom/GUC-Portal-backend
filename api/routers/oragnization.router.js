const express = require('express')

const router = express.Router()

const organizationController = require('../controllers/organization.controller')

const { createOrganization } = organizationController
const { verifiedPhone } = require('../../config/verifiedAuthentication')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
// const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

const {
  validateCreateOrganization,
} = require('../helpers/validations/organizationValidations')
router.post(
  '/createOrganization',
  validateCreateOrganization,
  verifyToken,
  verifyUser,
  verifiedPhone,
  createOrganization
)
module.exports = router
