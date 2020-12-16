const express = require("express")
const router = express.Router()
const {
createCourse,
updateCourse,
deleteCourse,
createFaculty,
createDepartment
} = require("../controllers/HR.controller")
const {
   validateCreateCourse,
   validateUpdateCourse,
   validateDeleteCourse,
   validateCreatefaculty,
   validateCreateDepartment
} = require('../helpers/validations/HRValidations')


router.post("/createCourse", validateCreateCourse ,createCourse)
router.post("/updateCourse", validateUpdateCourse ,updateCourse)
router.post("/deleteCourse", validateDeleteCourse ,deleteCourse)
router.post("/createFaculty",   validateCreatefaculty ,createFaculty)
router.post("/createDepartment",   validateCreateDepartment ,createDepartment)

module.exports = router
