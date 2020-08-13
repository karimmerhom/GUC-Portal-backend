const express = require("express")
const router = express.Router()
const packageController = require("../controllers/bookingExpiration.controller")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const packageValidations = require('../helpers/validations/bookingExpirationValidations')

const {
createBookingExpiration,
deleteBookingExpiration,
editBookingExpiration

} = packageController

const {
validateCreateBookingExpiration,
validateDeleteBookingExpiration,
validateEditBookingExpiration
} = packageValidations


router.post('/createBookingExpiration', verifyAdmin ,validateCreateBookingExpiration, createBookingExpiration)
router.post('/deleteBookingExpiration', verifyAdmin ,validateDeleteBookingExpiration, deleteBookingExpiration)
router.post('/editBookingExpiration', verifyAdmin ,validateEditBookingExpiration,editBookingExpiration)

module.exports = router
