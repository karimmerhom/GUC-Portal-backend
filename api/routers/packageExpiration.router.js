const express = require("express")
const router = express.Router()
const packageController = require("../controllers/packageExpiration.controller")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const packageValidations = require("../helpers/validations/packageExpirationValidations")

const { setPackageExpiration } = packageController

const { validateEditPackageExpiration } = packageValidations

router.post(
  "/setPackageExpiration",
  validateEditPackageExpiration,
  verifyAdmin,
  setPackageExpiration
)

module.exports = router
