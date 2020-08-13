const express = require('express')

const router = express.Router()

const packageController = require('../controllers/package.controller')

<<<<<<< HEAD
const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
=======
const { verifiedPhone } = require('../../config/verifiedAuthentication')
const { verifyToken } = require("../../config/AuthenticationMiddleWare")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const { verifyUser } = require("../../config/authUser")
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
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

router.post('/createPackage', validateCreatePackage, createPackage)
router.post('/editPackage', validateEditPackage, editPackage)
router.post('/viewPackage', validateViewPackage, viewPackage)
router.post('/viewAllPackages', validateViewAllPackages, viewAllPackages)
router.post('/deletePackage', validateViewPackage, deletePackage)

<<<<<<< HEAD
router.post('/purchasePackage', validatePurchasePackage, purchasePackage)
router.post('/cancelPackage', validateCancelPackage, cancelPackage)
router.post('/viewMyPackages', validateViewMyPackages, viewMyPackages)
=======
router.post('/createPackage', verifyAdmin ,validateCreatePackage, createPackage)
router.post('/editPackage', verifyAdmin ,validateEditPackage, editPackage)
router.post('/viewPackage' ,verifyToken,verifyUser,validateViewPackage, viewPackage)
router.post('/viewAllExtremePackages',verifyToken,verifyUser,validateViewAllPackages, viewAllExtremePackages)
router.post('/viewAllRegularPackages',verifyToken,verifyUser,validateViewAllPackages,  viewAllRegularPackages)
router.post('/deletePackage', verifyAdmin ,validateViewPackage, deletePackage)

router.post("/purchasePackage",validatePurchasePackage, purchasePackage)
router.post("/cancelPackage",validateCancelPackage, cancelPackage)
router.post("/viewMyPackages",validateViewMyPackages, viewMyPackages)
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0

module.exports = router
