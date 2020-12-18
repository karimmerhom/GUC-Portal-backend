const express = require("express")
const router = express.Router()
const {
createDepartment,
deleteDepartment,
updateDepartment
} = require("../controllers/departments.controller")
const {
   validateCreateDepartment,
   validateDeleteDepartment,
   validateUpdateDepartment
} = require('../helpers/validations/departmentsValidations')



router.post("/createDepartment",   validateCreateDepartment ,createDepartment)
router.post("/deleteDepartment",   validateDeleteDepartment ,deleteDepartment)
router.post("/updateDepartment",   validateUpdateDepartment ,updateDepartment)
module.exports = router
