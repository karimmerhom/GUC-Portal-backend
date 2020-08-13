<<<<<<< HEAD
const express = require('express')

const router = express.Router()

const packageController = require('../controllers/giftPackageAccess.controller')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')
const packageValidations = require('../helpers/validations/giftPackageAccessValidations')

const { createGiftPackageAccess, editGiftPackageAccess } = packageController

const {
  validateCreateGiftPackageAccess,
  validateEditGiftPackageAccess,
} = packageValidations

router.post(
  '/createGiftPackageAccess',
  validateCreateGiftPackageAccess,
  createGiftPackageAccess
)
router.post(
  '/editGiftPackageAccess',
  validateEditGiftPackageAccess,
  editGiftPackageAccess
)
=======
const express = require("express")
const router = express.Router()
const packageController = require("../controllers/giftPackageAccess.controller")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const packageValidations = require('../helpers/validations/giftPackageAccessValidations')

const {
 createGiftPackageAccess,
 editGiftPackageAccess,
 deleteGiftPackageAccess
} = packageController

const {
 validateCreateGiftPackageAccess,
 validateEditGiftPackageAccess,
 validateDeleteGiftPackageAccess

} = packageValidations


router.post('/createGiftPackageAccess', verifyAdmin ,validateCreateGiftPackageAccess, createGiftPackageAccess)
router.post('/editGiftPackageAccess', verifyAdmin ,validateEditGiftPackageAccess, editGiftPackageAccess)
router.post('/deleteGiftPackageAccess', verifyAdmin ,validateDeleteGiftPackageAccess, deleteGiftPackageAccess)
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0

module.exports = router
