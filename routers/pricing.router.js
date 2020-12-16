const express = require('express')

const router = express.Router()

const pricingController = require('../controllers/pricing.controller')

const {
  createPricing,
  deletePricing,
  editPricing,
  viewPricings,
} = pricingController

const {
  validateCreatePricing,
  validateDeletePricing,
  validateEditPricing,
  validateViewPricing,
} = require('../helpers/validations/pricingValidation')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post('/createPricing', validateCreatePricing, verifyAdmin, createPricing)
router.post('/editPricing', validateEditPricing, verifyAdmin, editPricing)
router.post('/deletePricing', validateDeletePricing, verifyAdmin, deletePricing)
router.post(
  '/viewPricings',
  validateViewPricing,
  verifyToken,
  verifyUser,
  viewPricings
)

module.exports = router
