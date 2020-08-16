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

router.post('/createPricing', verifyAdmin, validateCreatePricing, createPricing)
router.post('/editPricing', verifyAdmin, validateEditPricing, editPricing)
router.post('/deletePricing', verifyAdmin, validateDeletePricing, deletePricing)
router.post('/viewPricings', verifyAdmin, validateViewPricing, viewPricings)

module.exports = router
