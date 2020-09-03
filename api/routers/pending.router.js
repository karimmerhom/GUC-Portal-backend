const express = require('express')

const router = express.Router()

const pricingController = require('../controllers/pending.controller')

const { setpendingPackages, setpendingBookings } = pricingController

const {
  validateSetpending,
} = require('../helpers/validations/pendingValidation')

const { verifyToken } = require('../../config/AuthenticationMiddleWare')
const { verifyAdmin } = require('../../config/AdminAuthentication')
const { verifyUser } = require('../../config/authUser')

router.post(
  '/setpendingPackages',
  verifyAdmin,
  validateSetpending,
  setpendingPackages
)
router.post(
  '/setpendingBookings',
  verifyAdmin,
  validateSetpending,
  setpendingBookings
)

module.exports = router
