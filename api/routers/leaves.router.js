const express = require("express")
const router = express.Router()
const {
requestLeave
} = require("../controllers/leaves.controller")
const {
   validateRequestLeave
} = require('../helpers/validations/leavesValidations')
const {
   viewLeaveRequests
} = require("../controllers/leaves.controller")



router.post("/requestLeave",validateRequestLeave ,requestLeave)
module.exports = router
