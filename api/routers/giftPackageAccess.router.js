const express = require('express')

const router = express.Router()

const packageController = require('../controllers/giftPackageAccess.controller')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const packageValidations = require('../helpers/validations/giftPackageAccessValidations')

const { createGiftPackageAccess, editGiftPackageAccess } = packageController

const {
  validateCreateGiftPackageAccess,
  validateEditGiftPackageAccess,
} = packageValidations

router.post(
  '/createGiftPackageAccess',
  validateCreateGiftPackageAccess,
  createGiftPackageAccess
)
router.post(
  '/editGiftPackageAccess',
  validateEditGiftPackageAccess,
  editGiftPackageAccess
)

module.exports = router
