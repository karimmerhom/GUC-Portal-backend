const express = require("express")
const router = express.Router()
const {
createLocation,
assignLocation,
deleteLocation,
updateLocation
} = require("../controllers/locations.controller")
const {
validateCreateLocations,
validateAssignLocations,
validateDeleteLocation,
validateUpdateLocation
} = require('../helpers/validations/locationsValidations')



router.post("/createLocation",  validateCreateLocations ,createLocation)
router.post("/assignLocation",  validateAssignLocations ,assignLocation)
router.post("/deleteLocation",  validateDeleteLocation ,deleteLocation)
router.post("/updateLocation",  validateUpdateLocation ,updateLocation)
module.exports = router
