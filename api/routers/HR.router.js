const express = require("express")
const router = express.Router()
const {
createCourse,
updateCourse,
deleteCourse
} = require("../controllers/HR.controller")
const {
   validateCreateCourse,
   validateUpdateCourse,
   validateDeleteCourse
} = require('../helpers/validations/HRValidations')


router.post("/createCourse", validateCreateCourse ,createCourse)
router.post("/updateCourse", validateUpdateCourse ,updateCourse)
router.post("/deleteCourse", validateDeleteCourse ,deleteCourse)


module.exports = router
