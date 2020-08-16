const express = require('express')
const router = express.Router()
const packageController = require('../controllers/giftPackageAccess.controller')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const packageValidations = require('../helpers/validations/giftPackageAccessValidations')

const {
  createGiftPackageAccess,
  editGiftPackageAccess,
  deleteGiftPackageAccess,
} = packageController

const {
  validateCreateGiftPackageAccess,
  validateEditGiftPackageAccess,
  validateDeleteGiftPackageAccess,
} = packageValidations

router.post(
  '/createGiftPackageAccess',
  validateCreateGiftPackageAccess,
  verifyAdmin,
  createGiftPackageAccess
)
router.post(
  '/editGiftPackageAccess',
  validateEditGiftPackageAccess,
  verifyAdmin,
  editGiftPackageAccess
)
router.post(
  '/deleteGiftPackageAccess',
  validateDeleteGiftPackageAccess,
  verifyAdmin,
  deleteGiftPackageAccess
)

module.exports = router
