const express = require('express')
const router = express.Router()
const {
  createLocation,
  assignLocation,
  deleteLocation,
  updateLocation,
} = require('../controllers/locations.controller')
const {
  verifyToken,
} = require('../helpers/authentication/AuthenticationMiddleWare')
const { verifyUser } = require('../helpers/authentication/authUser')
const { verifyHR } = require('../helpers/authentication/HRAuthentication')
const {
  validateCreateLocations,
  validateAssignLocations,
  validateDeleteLocation,
  validateUpdateLocation,
} = require('../helpers/validations/locationsValidations')

router.post(
  '/createLocation',
  validateCreateLocations,
  verifyToken,
  verifyUser,
  verifyHR,
  createLocation
)
router.post(
  '/assignLocation',
  validateAssignLocations,
  verifyToken,
  verifyUser,
  verifyHR,
  assignLocation
)
router.post(
  '/deleteLocation',
  validateDeleteLocation,
  verifyToken,
  verifyUser,
  verifyHR,
  deleteLocation
)
router.post(
  '/updateLocation',
  validateUpdateLocation,
  verifyToken,
  verifyUser,
  verifyHR,
  updateLocation
)
module.exports = router
