const express = require("express")
const router = express.Router()
const {
   createReplacementRequest
} = require("../controllers/replacementsRequests.controller")
const {
   validatecreateReplacementRequest
} = require('../helpers/validations/replacementsRequestsValidations')



router.post("/createReplacementRequest",validatecreateReplacementRequest ,createReplacementRequest)
module.exports = router
