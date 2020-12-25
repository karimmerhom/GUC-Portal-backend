const express = require("express")
const router = express.Router()
const {
  requestChangeDayOff,
  updateRequest
} = require("../controllers/changeDayOff.controller")
const {
  validateRequestChangeDayOff,
  validateUpdateRequest
} = require('../helpers/validations/changeDayOffValidations')



router.post("/requestChangeDayOff", validateRequestChangeDayOff,requestChangeDayOff)
router.post("/updateRequest", validateUpdateRequest,updateRequest)
module.exports = router
