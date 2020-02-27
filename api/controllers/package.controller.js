const validator = require('../helpers/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const {
  accountStatus,
  slotStatus,
  userTypes
} = require('../constants/TBH.enum')
const { Op } = require('sequelize')
const PackageModel = require('../../models/package.model')
const { generateOTP } = require('../helpers/helpers')
const VerificationCode = require('../../models/verificationCodes')
const pricingModel = require('../../models/pricing.model')
const accountModel = require('../../models/account.model')
const bookingModel = require('../../models/booking.model')

const create_package = async (req, res) => {
  try {
    const isValid = validator.validateCreatePackage(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package, Account } = req.body
    const account = await accountModel.findOne({
      where: { id: Account.id }
    })
    if (!account) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'User not found'
      })
    }
    if (account.status === accountStatus.PENDING) {
      return res.json({
        code: errorCodes.unVerified,
        error: 'Account must be verified'
      })
    }
    const checkPrice = await pricingModel.findOne({
      where: { code: Package.package }
    })
    if (!checkPrice) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Invalid package code'
      })
    }
    if (checkPrice.roomType !== Package.roomType) {
      return res.json({
        code: errorCodes.invalidPackage,
        error: 'This package is not for this room type'
      })
    }
    let price
    if (checkPrice.hoursRangeFrom === null) {
      price = Package.numberOfHours * checkPrice.price
    } else {
      if (
        checkPrice.hoursRangeTo !== null &&
        checkPrice.hoursRangeFrom !== null
      ) {
        if (
          Package.numberOfHours > checkPrice.hoursRangeTo ||
          Package.numberOfHours < checkPrice.hoursRangeFrom
        ) {
          return res.json({
            code: errorCodes.invalidPackage,
            error: 'Hours not in the range for this package'
          })
        } else {
          price = Package.numberOfHours * checkPrice.price
        }
      } else {
        if (
          checkPrice.hoursRangeTo === null &&
          checkPrice.hoursRangeFrom !== null &&
          Package.numberOfHours < checkPrice.hoursRangeFrom
        ) {
          {
            return res.json({
              code: errorCodes.invalidPackage,
              error: 'Hours not in the range for this package'
            })
          }
        } else {
          price = Package.numberOfHours * checkPrice.price
        }
      }
    }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })
    await PackageModel.create({
      code,
      remaining: Package.numberOfHours,
      status: accountStatus.PENDING,
      package: Package.package,
      price,
      roomType: Package.roomType,
      accountId: Account.id
    })
    return res.json({ code: errorCodes.success, packageCode: code, price })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const calculate_package_price = async (req, res) => {
  try {
    const isValid = validator.validateCreatePackage(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package, Account } = req.body
    const account = await accountModel.findOne({
      where: { id: Account.id }
    })
    if (!account) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'User not found'
      })
    }
    if (account.status === accountStatus.PENDING) {
      return res.json({
        code: errorCodes.unVerified,
        error: 'Account must be verified'
      })
    }
    const checkPrice = await pricingModel.findOne({
      where: { code: Package.package }
    })
    if (!checkPrice) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Invalid package code'
      })
    }
    if (checkPrice.roomType !== Package.roomType) {
      return res.json({
        code: errorCodes.invalidPackage,
        error: 'This package is not for this room type'
      })
    }
    let price
    if (checkPrice.hoursRangeFrom === null) {
      price = Package.numberOfHours * checkPrice.price
    } else {
      if (
        checkPrice.hoursRangeTo !== null &&
        checkPrice.hoursRangeFrom !== null
      ) {
        if (
          Package.numberOfHours > checkPrice.hoursRangeTo ||
          Package.numberOfHours < checkPrice.hoursRangeFrom
        ) {
          return res.json({
            code: errorCodes.invalidPackage,
            error: 'Hours not in the range for this package'
          })
        } else {
          price = Package.numberOfHours * checkPrice.price
        }
      } else {
        if (
          checkPrice.hoursRangeTo === null &&
          checkPrice.hoursRangeFrom !== null &&
          Package.numberOfHours < checkPrice.hoursRangeFrom
        ) {
          {
            return res.json({
              code: errorCodes.invalidPackage,
              error: 'Hours not in the range for this package'
            })
          }
        } else {
          price = Package.numberOfHours * checkPrice.price
        }
      }
    }
    return res.json({ code: errorCodes.success, price })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const view_package_by_code = async (req, res) => {
  try {
    const isValid = validator.validateViewPackageByCode(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package } = req.body
    const package = await PackageModel.findOne({
      where: {
        code: Package.code
      }
    })
    if (
      package.accountId !== req.data.id &&
      req.data.type !== userTypes.ADMIN
    ) {
      return res.json({ code: errorCodes.unauthorized, error: 'breach' })
    }
    return res.json({ code: errorCodes.success, package })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const edit_package_by_code = async (req, res) => {
  try {
    const isValid = validator.validateEditPackageByCode(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package } = req.body
    const package = await PackageModel.findOne({
      where: {
        code: Package.code
      }
    })
    if (!package) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Package not found'
      })
    }
    if (
      package.accountId !== req.data.id &&
      req.data.type !== userTypes.ADMIN
    ) {
      return res.json({ code: errorCodes.unauthorized, error: 'breach' })
    }
    await PackageModel.update(
      {
        status: Package.status
      },
      { where: { code: Package.code } }
    )
    await bookingModel.update(
      { status: accountStatus.CONFIRMED },
      {
        where: {
          status: accountStatus.PENDING,
          price: 0,
          packageCode: Package.code
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const view_pricings = async (req, res) => {
  try {
    const packages = await pricingModel.findAll()
    return res.json({ code: errorCodes.success, packages })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const view_packages_for_user = async (req, res) => {
  try {
    const isValid = validator.validateShowMyPackages(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Account } = req.body
    const packages = await PackageModel.findAll({
      where: { accountId: Account.id }
    })
    return res.json({ code: errorCodes.success, packages })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const view_all_packages = async (req, res) => {
  try {
    const packages = await PackageModel.findAll()
    return res.json({ code: errorCodes.success, packages })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const gift_package = async (req, res) => {
  try {
    const isValid = validator.validateGiftPackage(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package, Account } = req.body
    const account = await accountModel.findOne({
      where: { id: Account.id }
    })
    if (!account) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'User not found'
      })
    }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })
    const packageCreated = await PackageModel.create({
      code,
      remaining: Package.numberOfHours,
      status: accountStatus.ACTIVE,
      package: 'custom',
      price: 0,
      roomType: Package.roomType,
      accountId: Account.id
    })
    return res.json({ code: errorCodes.success, packageCode: code })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  create_package,
  view_package_by_code,
  edit_package_by_code,
  calculate_package_price,
  view_pricings,
  view_packages_for_user,
  view_all_packages,
  gift_package
}
