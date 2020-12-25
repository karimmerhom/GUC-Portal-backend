const express = require("express")
const router = express.Router()
const {
  requestChangeDayOff,
  updateRequest,
  viewSentReq,
  viewAllRequests
} = require("../controllers/changeDayOff.controller")
const {
  validateRequestChangeDayOff,
  validateUpdateRequest,
  validateViewSentReq
} = require('../helpers/validations/changeDayOffValidations')



router.post("/requestChangeDayOff", validateRequestChangeDayOff,requestChangeDayOff)
router.post("/updateRequest", validateUpdateRequest,updateRequest)
router.post("/viewSentReq",validateViewSentReq,viewSentReq) 
router.post("/viewAllRequests",validateViewSentReq,viewAllRequests)
module.exports = router
