const express = require("express")
const router = express.Router()
const {
createDepartment,
deleteDepartment
} = require("../controllers/departments.controller")
const {
   validateCreateDepartment,
   validateDeleteDepartment
} = require('../helpers/validations/departmentsValidations')



router.post("/createDepartment",   validateCreateDepartment ,createDepartment)
router.post("/deleteDepartment",   validateDeleteDepartment ,deleteDepartment)

module.exports = router
