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
  verifyAdmin,
  validateCreateGiftPackageAccess,
  createGiftPackageAccess
)
router.post(
  '/editGiftPackageAccess',
  verifyAdmin,
  validateEditGiftPackageAccess,
  editGiftPackageAccess
)
router.post(
  '/deleteGiftPackageAccess',
  verifyAdmin,
  validateDeleteGiftPackageAccess,
  deleteGiftPackageAccess
)

module.exports = router
