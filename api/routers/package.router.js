const express = require('express')

const router = express.Router()

const packageController = require('../controllers/package.controller')

const { verifiedPhone } = require('../../config/verifiedAuthentication')
const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const packageValidations = require('../helpers/validations/packageValidations')

const {
  createPackage,
  editPackage,
  viewPackage,
  purchasePackage,
  cancelPackage,
  viewMyPackages,
  deletePackage,
  redeemGift,
  sendGift,
  viewAllExtremePackages,
  viewAllRegularPackages,
  editStatus,
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
  validateEditStatus,
} = packageValidations

router.post('/createPackage', validateCreatePackage, verifyAdmin, createPackage)
router.post('/editPackage', validateEditPackage, verifyAdmin, editPackage)
router.post(
  '/viewPackage',
  validateViewPackage,
  verifyToken,
  verifyUser,
  viewPackage
)
router.post('/deletePackage', validateViewPackage, verifyAdmin, deletePackage)

router.post(
  '/viewAllExtremePackages',
  validateViewAllPackages,
  verifyToken,
  verifyUser,
  viewAllExtremePackages
)
router.post(
  '/viewAllRegularPackages',
  validateViewAllPackages,
  verifyToken,
  verifyUser,
  viewAllRegularPackages
)

router.post(
  '/purchasePackage',
  validatePurchasePackage,
  verifyToken,
  verifyUser,
  verifiedPhone,
  purchasePackage
)
router.post(
  '/cancelPackage',
  validateCancelPackage,
  verifyToken,
  verifyUser,
  verifiedPhone,
  cancelPackage
)
router.post(
  '/viewMyPackages',
  validateViewMyPackages,
  verifyToken,
  verifyUser,
  verifiedPhone,
  viewMyPackages
)
router.post(
  '/redeemGift',
  validateRedeemGift,
  verifyToken,
  verifyUser,
  verifiedPhone,
  redeemGift
)
router.post(
  '/sendGift',
  validateSendGift,
  verifyToken,
  verifyUser,
  verifiedPhone,
  sendGift
)

router.post(
  '/editStatus',
  validateEditStatus,
  verifyAdmin,
  editStatus
)

module.exports = router
