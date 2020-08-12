const express = require("express")

const router = express.Router()

const packageController = require("../controllers/package.controller")

const { verifiedPhone } = require('../../config/verifiedAuthentication')
const { verifyToken } = require("../../config/AuthenticationMiddleWare")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const { verifyUser } = require("../../config/authUser")
const packageValidations = require('../helpers/validations/packageValidations')

const {
  createPackage,
  editPackage,
  viewPackage,
  purchasePackage,
  cancelPackage,
  viewMyPackages,
  deletePackage,
  viewAllExtremePackages,
  viewAllRegularPackages
} = packageController

const {
  validateCreatePackage,
  validateEditPackage,
  validateViewPackage,
  validateViewAllPackages,
  validatePurchasePackage,
  validateCancelPackage,
  validateViewMyPackages,
} = packageValidations


router.post('/createPackage', verifyAdmin ,validateCreatePackage, createPackage)
router.post('/editPackage', verifyAdmin ,validateEditPackage, editPackage)
router.post('/viewPackage' ,verifyToken,verifyUser,validateViewPackage, viewPackage)
router.post('/viewAllExtremePackages',verifyToken,verifyUser,validateViewAllPackages, viewAllExtremePackages)
router.post('/viewAllRegularPackages',verifyToken,verifyUser,validateViewAllPackages,  viewAllRegularPackages)
router.post('/deletePackage', verifyAdmin ,validateViewPackage, deletePackage)

router.post("/purchasePackage",validatePurchasePackage, purchasePackage)
router.post("/cancelPackage",validateCancelPackage, cancelPackage)
router.post("/viewMyPackages",validateViewMyPackages, viewMyPackages)

module.exports = router
