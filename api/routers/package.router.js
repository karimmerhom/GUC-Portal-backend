const express = require("express")

const router = express.Router()

const packageController = require("../controllers/package.controller")

const { createPackage, purchasePackage } = packageController

const { verifyToken } = require("../../config/AuthenticationMiddleWare")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const { verifyUser } = require("../../config/authUser")
const packageValidations = require('../helpers/validations/packageValidations')

router.post("/purchasePackage", purchasePackage)
const {
  createPackage,
  editPackage,
  viewPackage,
  viewAllPackages
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

module.exports = router
