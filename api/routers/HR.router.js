const express = require("express")
const router = express.Router()
const {
createCourse,
updateCourse
} = require("../controllers/HR.controller")
const {
   validateCreateCourse,
   validateUpdateCourse
} = require('../helpers/validations/HRValidations')


router.post("/createCourse", validateCreateCourse ,createCourse)
router.post("/updateCourse", validateUpdateCourse ,updateCourse)


module.exports = router
