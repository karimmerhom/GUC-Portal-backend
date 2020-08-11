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

router.post('/createPricing', validateCreatePricing, createPricing)
router.post('/editPricing', validateEditPricing, editPricing)
router.post('/deletePricing', validateDeletePricing, deletePricing)
router.post('/viewPricings', validateViewPricing, viewPricings)

module.exports = router
