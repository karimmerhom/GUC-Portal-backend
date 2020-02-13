const express = require('express')
const router = express.Router()

const packageController = require('../controllers/package.controller')

const {
  create_package,
  cancel_all_packages,
  cancel_specific_package,
  view_package_by_name,
  view_package_by_code,
  edit_package_by_code,
  edit_package_by_name,
  calculate_package_price
} = packageController

router.post('/addpackage', create_package)
router.post('/calculatepackageprice', calculate_package_price)
router.post('/cancelallpackages', cancel_all_packages)
router.post('/cancelspecificpackage', cancel_specific_package)
router.post('/viewpackagebyname', view_package_by_name)
router.post('/viewpackagebycode', view_package_by_code)
router.post('/editpackagebycode', edit_package_by_code)
router.post('/editpackagebyname', edit_package_by_name)

module.exports = router
