const bcrypt = require('bcrypt')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const validator = require('../helpers/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const { secretOrKey } = require('../../config/keys')
const { accountStatus, verificationMethods } = require('../constants/TBH.enum')
const VerificationCode = require('../../models/verificationCodes')
const { generateOTP } = require('../helpers/helpers')

const add_booking = async (req, res) => {
  try {
    const isValid = validator.validateAddBooking(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: 'Validation error'
      })
    }
    const { Booking, Account } = req.body
    const { id } = req.data
    if (parseInt(id) !== parseInt(Account.id)) {
      return res.json({ code: errorCodes.authentication, error: 'breach' })
    }
    const account = await AccountModel.findOne({
      where: {
        id: parseInt(id)
      }
    })
    if (!account) {
      return res.json({
        code: errorCodes.invalidCredentials,
        error: 'User not found'
      })
    }
    if (account.status === accountStatus.PENDING) {
      return res.json({
        code: errorCodes.unVerified,
        error: 'Account must be verified'
      })
    }
    if (Booking.date < new Date()) {
      return res.json({
        code: errorCodes.dateInThePast,
        error: 'Date cannot be in the past'
      })
    }
    res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  add_booking
}
