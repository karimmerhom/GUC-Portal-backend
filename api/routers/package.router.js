const express = require('express')

const router = express.Router()

const packageController = require('../controllers/package.controller')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
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

router.post('/purchasePackage', validatePurchasePackage, purchasePackage)
router.post('/cancelPackage', validateCancelPackage, cancelPackage)
router.post('/viewMyPackages', validateViewMyPackages, viewMyPackages)

module.exports = router
