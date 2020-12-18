const express = require("express")
const router = express.Router()
const {
createFaculty,
} = require("../controllers/faculties.controller")
const {
   validateCreatefaculty,
} = require('../helpers/validations/facultiesValidations')



router.post("/createFaculty",   validateCreatefaculty ,createFaculty)


module.exports = router
