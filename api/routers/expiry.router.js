const express = require('express')

const router = express.Router()

const pricingController = require('../controllers/expiry.controller')

const { setExpiryDuration, turnOffExpiry, turnOnExpiry } = pricingController

const {
  validateSetExpiryDuration,
} = require('../helpers/validations/expiryValidation')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post(
  '/setExpiryDuration',
  //verifyAdmin,
  validateSetExpiryDuration,
  setExpiryDuration
)
router.post(
  '/turnOnExpiry',
  //verifyAdmin,
  turnOnExpiry
)
router.post(
  '/turnOffExpiry',
  //verifyAdmin,
  turnOffExpiry
)

module.exports = router
