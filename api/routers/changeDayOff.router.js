const express = require("express")
const router = express.Router()
const {
  requestChangeDayOff,
  updateRequest,
  viewSentReq
} = require("../controllers/changeDayOff.controller")
const {
  validateRequestChangeDayOff,
  validateUpdateRequest,
  validateViewSentReq
} = require('../helpers/validations/changeDayOffValidations')



router.post("/requestChangeDayOff", validateRequestChangeDayOff,requestChangeDayOff)
router.post("/updateRequest", validateUpdateRequest,updateRequest)
router.post("/viewSentReq",validateViewSentReq,viewSentReq) 
module.exports = router
