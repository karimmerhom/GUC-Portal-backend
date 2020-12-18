const express = require("express")
const router = express.Router()
const {
createCourse,
updateCourse,
deleteCourse,
} = require("../controllers/courses.controller")
const {
   validateCreateCourse,
   validateUpdateCourse,
   validateDeleteCourse,
} = require('../helpers/validations/coursesValidations')


router.post("/createCourse", validateCreateCourse ,createCourse)
router.post("/updateCourse", validateUpdateCourse ,updateCourse)
router.post("/deleteCourse", validateDeleteCourse ,deleteCourse)


module.exports = router
