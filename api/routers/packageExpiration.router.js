const express = require("express")
const router = express.Router()
const packageController = require("../controllers/packageExpiration.controller")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const packageValidations = require("../helpers/validations/packageExpirationValidations")

const {
  createPackageExpiration,
  deletePackageExpiration,
  editPackageExpiration,
} = packageController

const {
  validateCreatePackageExpiration,
  validateDeletePackageExpiration,
  validateEditPackageExpiration,
} = packageValidations

router.post(
  "/createPackageExpiration",
  validateCreatePackageExpiration,
  verifyAdmin,
  createPackageExpiration
)
router.post(
  "/deletePackageExpiration",
  validateDeletePackageExpiration,
  verifyAdmin,
  deletePackageExpiration
)
router.post(
  "/editPackageExpiration",
  validateEditPackageExpiration,
  verifyAdmin,
  editPackageExpiration
)

module.exports = router
