const express = require("express")
const router = express.Router()
const packageController = require("../controllers/giftPackageAccess.controller")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const packageValidations = require("../helpers/validations/giftPackageAccessValidations")

const { setGiftPackageAccess } = packageController

const { validateEditGiftPackageAccess } = packageValidations

router.post(
  "/setGiftPackageAccess",
  validateEditGiftPackageAccess,

  setGiftPackageAccess
)

module.exports = router
