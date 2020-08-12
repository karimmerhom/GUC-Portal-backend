const express = require("express")

const router = express.Router()

const packageController = require("../controllers/bookingExpiration.controller")


const { verifyToken } = require("../../config/AuthenticationMiddleWare")
const { verifyAdmin } = require("../../config/AdminAuthentication")
const { verifyUser } = require("../../config/authUser")
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


router.post('/createBookingExpiration',validateCreateBookingExpiration, createBookingExpiration)
router.post('/deleteBookingExpiration',validateDeleteBookingExpiration, deleteBookingExpiration)
router.post('/editBookingExpiration',validateEditBookingExpiration,editBookingExpiration)

module.exports = router
