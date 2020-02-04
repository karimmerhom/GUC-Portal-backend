const bcrypt = require('bcrypt')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account.model')
const validator = require('../helpers/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')
const { secretOrKey } = require('../../config/keys')
const { accountStatus, slotStatus } = require('../constants/TBH.enum')
const VerificationCode = require('../../models/verificationCodes')
const { generateOTP } = require('../helpers/helpers')
const BookingModel = require('../../models/booking.model')
const CalendarModel = require('../../models/calendar.model')
const PackageModel = require('../../models/package.model')

const create_package = async (req, res) => {
  try {
    const isValid = validator.validateCreatePackage(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package } = req.body
    const checkPackage = await PackageModel.findOne({
      where: { code: Package.code }
    })
    if (checkPackage) {
      return res.json({
        code: errorCodes.packageAlreadyExists,
        error: 'Package already exists'
      })
    }
    await PackageModel.create({
      code: Package.code,
      usage: 0,
      remaining: Package.packageSize,
      status: accountStatus.ACTIVE
    })
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  create_package
}
