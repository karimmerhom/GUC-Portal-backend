const express = require("express")
const router = express.Router()
const {
createLocation
} = require("../controllers/locations.controller")
const {
validateCreateLocations
} = require('../helpers/validations/locationsValidations')



router.post("/createLocation",  validateCreateLocations ,createLocation)

module.exports = router
