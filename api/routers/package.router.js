const express = require('express')

const router = express.Router()

const packageController = require('../controllers/package.controller')

const packageValidations = require('../helpers/validations/packageValidations')

const {
  createPackage
} = packageController

const {
  validateCreatePackage
} = packageValidations

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/createPackage',validateCreatePackage, createPackage)

module.exports = router
