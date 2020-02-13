const express = require('express')
const router = express.Router()

const packageController = require('../controllers/package.controller')

const {
  create_package,
  view_package_by_code,
  edit_package_by_code,
  calculate_package_price,
  view_pricings,
  view_packages_for_user
} = packageController

const { verifyUser } = require('../../config/authUser')
const { verifyToken } = require('../../config/AuthenticationMiddleWare')

router.post('/addpackage', create_package)
router.post('/calculatepackageprice', calculate_package_price)
router.post('/viewpackagebycode', view_package_by_code)
router.post('/editpackagebycode', edit_package_by_code)
router.post('/viewpricings', view_pricings)
router.post(
  '/viewpackagesforuser',
  verifyToken,
  verifyUser,
  view_packages_for_user
)

module.exports = router
