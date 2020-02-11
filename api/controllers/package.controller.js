const validator = require('../helpers/bookingValidations')
const errorCodes = require('../constants/errorCodes')
const { accountStatus, slotStatus } = require('../constants/TBH.enum')
const PackageModel = require('../../models/package.model')
const { generateOTP } = require('../helpers/helpers')
const VerificationCode = require('../../models/verificationCodes')

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
    // const checkPackage = await PackageModel.findOne({
    //   where: { code: Package.code }
    // })
    // if (checkPackage) {
    //   return res.json({
    //     code: errorCodes.packageAlreadyExists,
    //     error: 'Package already exists'
    //   })
    // }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })
    console.log(code)
    await PackageModel.create({
      code,
      usage: 0,
      remaining: Package.packageSize,
      status: accountStatus.ACTIVE,
      package: Package.package,
      price: Package.price,
      roomType: Package.roomType,
      accountId: Package.accountId
    })
    return res.json({ code: errorCodes.success, packageCode: code })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const cancel_specific_package = async (req, res) => {
  try {
    const isValid = validator.validateCancelSpecificPackage(req.body)
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
    if (!checkPackage) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Package does not exist'
      })
    }
    await PackageModel.update(
      { status: accountStatus.CANCELED },
      { where: { code: Package.code } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const cancel_all_packages = async (req, res) => {
  try {
    const isValid = validator.validateCancelAllPackages(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package } = req.body
    const checkPackage = await PackageModel.findOne({
      where: { name: Package.name }
    })
    if (!checkPackage) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Package does not exist'
      })
    }
    await PackageModel.update(
      {
        status: accountStatus.CANCELED
      },
      {
        where: {
          name: Package.name
        }
      }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const view_package_by_name = async (req, res) => {
  try {
    const isValid = validator.validateViewPackageByName(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package } = req.body
    const packages = await PackageModel.findAll({
      where: {
        name: Package.name
      }
    })
    return res.json({ code: errorCodes.success, packages })
  } catch (exception) {
    console.log(exception)
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
    await PackageModel.update(
      {
        status: Package.status
      },
      { where: { code: Package.code } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const edit_package_by_name = async (req, res) => {
  try {
    const isValid = validator.validateEditPackageByName(req.body)
    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message
      })
    }
    const { Package } = req.body
    const package = await PackageModel.findOne({
      where: {
        name: Package.name
      }
    })
    if (!package) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'Package not found'
      })
    }
    await PackageModel.update(
      {
        status: Package.status
      },
      { where: { name: Package.name } }
    )
    return res.json({ code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  create_package,
  cancel_all_packages,
  cancel_specific_package,
  view_package_by_name,
  view_package_by_code,
  edit_package_by_code,
  edit_package_by_name
}
