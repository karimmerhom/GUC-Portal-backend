const express = require('express')

const router = express.Router()

const packageController = require('../controllers/package.controller')

const packageValidations = require('../helpers/validations/packageValidations')

const {
  createPackage,
  editPackage,
  viewPackage,
  viewAllPackages,
  deletePackage
} = packageController

const {
  validateCreatePackage,
  validateEditPackage,
  validateViewPackage,
  validateViewAllPackages
} = packageValidations

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/createPackage',validateCreatePackage, createPackage)
router.post('/editPackage',validateEditPackage, editPackage)
router.post('/viewPackage',validateViewPackage, viewPackage)
router.post('/viewAllPackages',validateViewAllPackages, viewAllPackages)
router.post('/deletePackage',validateViewPackage, deletePackage)

module.exports = router
