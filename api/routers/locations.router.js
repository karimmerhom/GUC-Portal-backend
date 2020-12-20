const express = require("express")
const router = express.Router()
const {
createLocation,
assignLocation
} = require("../controllers/locations.controller")
const {
validateCreateLocations,
validateAssignLocations
} = require('../helpers/validations/locationsValidations')



router.post("/createLocation",  validateCreateLocations ,createLocation)
router.post("/assignLocation",  validateAssignLocations ,assignLocation)

module.exports = router
