const express = require("express")
const router = express.Router()
const {
createFaculty,
deleteFaculty,
updateFaculty
} = require("../controllers/faculties.controller")
const {
   validateCreatefaculty,
   validateDeleteFaculty,
   validateUpdateFaculty
} = require('../helpers/validations/facultiesValidations')



router.post("/createFaculty",   validateCreatefaculty ,createFaculty)
router.post("/deleteFaculty",   validateDeleteFaculty ,deleteFaculty)
router.post("/updateFaculty",   validateUpdateFaculty ,updateFaculty)

module.exports = router
