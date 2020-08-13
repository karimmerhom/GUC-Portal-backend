const express = require("express")

const router = express.Router()

const packageController = require("../controllers/package.controller")

const { verifiedPhone } = require('../../config/verifiedAuthentication')
const { verifyToken } = require("../../config/AuthenticationMiddleWare")
const { verifyAdmin  } = require("../../config/AdminAuthentication")
const { verifyUser } = require("../../config/authUser")

const packageValidations = require('../helpers/validations/packageValidations')

const {
  createPackage,
  editPackage,
  viewPackage,
  viewAllPackages,
  purchasePackage,
  cancelPackage,
  viewMyPackages,
  deletePackage,
  redeemGift,
  sendGift
} = packageController

const {
  validateCreatePackage,
  validateEditPackage,
  validateViewPackage,
  validateViewAllPackages,
  validatePurchasePackage,
  validateCancelPackage,
  validateViewMyPackages,
  validateRedeemGift,
  validateSendGift,
} = packageValidations


router.post('/createPackage',validateCreatePackage, createPackage)
router.post('/editPackage',validateEditPackage, editPackage)
router.post('/viewPackage',validateViewPackage, viewPackage)
router.post('/viewAllPackages',validateViewAllPackages, viewAllPackages)
router.post('/deletePackage',validateViewPackage, deletePackage)

router.post("/purchasePackage", validatePurchasePackage , verifyToken , verifyUser , verifiedPhone , purchasePackage)
router.post("/cancelPackage", validateCancelPackage , verifyToken , verifyUser , verifiedPhone , cancelPackage)
router.post("/viewMyPackages",validateViewMyPackages, verifyToken , verifyUser , verifiedPhone ,viewMyPackages)
router.post("/redeemGift",validateRedeemGift, verifyToken , verifyUser , verifiedPhone ,redeemGift)
router.post("/sendGift",validateSendGift, verifyToken , verifyUser , verifiedPhone ,sendGift)
module.exports = router
