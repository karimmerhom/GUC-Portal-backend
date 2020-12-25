const express = require("express")
const router = express.Router()
const {
   createReplacementRequest,
   updateReplacementRequestStatus,
   viewRecievedReq,
   viewSentReq
} = require("../controllers/replacementsRequests.controller")
const {
  validateCreateReplacementRequest,
  validateUpdateReplacementRequestStatus,
  validateViewRecievedReq
} = require('../helpers/validations/replacementsRequestsValidations')



router.post("/createReplacementRequest", validateCreateReplacementRequest,createReplacementRequest)
router.post("/updateReplacementRequestStatus", validateUpdateReplacementRequestStatus,updateReplacementRequestStatus)
router.post("/viewRecievedReq", validateViewRecievedReq,viewRecievedReq)
router.post("/viewSentReq", validateViewRecievedReq,viewSentReq)
module.exports = router
