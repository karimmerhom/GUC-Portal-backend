const extremePackage = require('../../models/extremePackage.model')
const regularPackage = require('../../models/regularPackage.model')
const purchasedPackage = require('../../models/purchasedPackages.model')
const accountsModel = require('../../models/account.model')
const giftModel = require('../../models/giftOtp.model')
const {
  packageStatus,
  packageType,
  otpStatus,
} = require('../constants/TBH.enum')
const errorCodes = require('../constants/errorCodes')
const {
  addPoints,
  generateOTP,
  refund,
  deductPoints,
} = require('../helpers/helpers')
const giftOtp = require('../../models/giftOtp.model')

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

const createPackage = async (req, res) => {
  try {
    const body = req.body
    const name = req.body.packageName
    const Type = req.body.packageType

    delete body.packageType
    if (Type === packageType.REGULAR) {
      delete body.packageType
      const found = await regularPackage.findOne({
        where: {
          packageName: name,
        },
      })

      if (!found) {
        await regularPackage.create(body)
        return res.json({
          code: errorCodes.success,
        })
      }
    }
    if (Type === packageType.EXTREME) {
      delete body.packageType
      const found = await extremePackage.findOne({
        where: {
          packageName: name,
        },
      })
      if (!found) {
        await extremePackage.create(body)
        return res.json({
          code: errorCodes.success,
        })
      }
    }
    return res.json({
      code: errorCodes.nameExists,
      error: 'name already exists',
    })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const editPackage = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    delete body.id
    const Type = req.body.packageType
    if (Type === packageType.REGULAR) {
      delete body.packageType
      await regularPackage.update(body, {
        where: {
          id: id,
        },
      })

      return res.json({
        code: errorCodes.success,
      })
    }
    if (Type === packageType.EXTREME) {
      delete body.packageType
      await extremePackage.update(body, {
        where: {
          id: id,
        },
      })

      return res.json({
        code: errorCodes.success,
      })
    }
    return res.json({ code: errorCodes.invalidId, error: 'id does not exist' })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const purchasePackage = async (req, res) => {
  try {
    const Type = req.body.packageType
    const Id = req.body.packageId
    const accountId = req.body.Account.id
    const r = await addPoints(accountId, Type, Id)
    return res.json(r)
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const cancelPackage = async (req, res) => {
  try {
    if (!purchasedPackage.findOne({ where: { id: req.body.Account.id } })) {
      return res.json({ code: errorCodes.unknown, error: 'wrong account' })
    }

    const body = req.body
    const bodyId = req.body.packageId
    const package = await purchasedPackage.findByPk(bodyId)
    if (package.status === packageStatus.CANCELED) {
      return res.json({
        code: errorCodes.packageCanceled,
        error: 'package already canceled',
      })
    }
    if (parseInt(package.accountId) !== parseInt(req.body.Account.id)) {
      return res.json({
        code: errorCodes.unknown,
        error: 'package does not belong to user',
      })
    }
    body.status = packageStatus.CANCELED
    await purchasedPackage.update(body, { where: { id: bodyId } })
    return res.json({
      code: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewPackage = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    delete body.id
    const Type = req.body.packageType
    if (Type === packageType.REGULAR) {
      delete body.packageType
      const packageFound = await regularPackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if (packageFound)
        return res.json({ package: packageFound, code: errorCodes.success })
    }
    if (Type === packageType.EXTREME) {
      const packageFound = await extremePackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if (packageFound)
        return res.json({ package: packageFound, code: errorCodes.success })
    }
    return res.json({
      statusCode: errorCodes.invalidPackage,
      error: 'package not found',
    })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewAllRegularPackages = async (req, res) => {
  try {
    const packagesFound1 = await regularPackage.findAll({})
    return res.json({ package: packagesFound1, code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewAllExtremePackages = async (req, res) => {
  try {
    const packagesFound2 = await extremePackage.findAll({})
    return res.json({ package: packagesFound2, code: errorCodes.success })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewMyPackages = async (req, res) => {
  try {
    const purchases = await purchasedPackage.findAll({
      where: { accountId: req.body.Account.id },
    })
    if (!purchases) {
      return { error: 'account did not purchase any packages' }
    }
    const activePackages = purchases.filter((account) => {
      return (
        account.status === packageStatus.ACTIVE &&
        account.packageType === packageType.REGULAR
      )
    })

    let total = 0
    for (package of activePackages) {
      total += parseInt(package.totalPoints)
    }
    return res.json({
      purchasedPackages: { purchases, total: total },
      code: 7000,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const deletePackage = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    delete body.id
    const Type = req.body.packageType

    if (Type === packageType.REGULAR) {
      delete body.packageType
      const packageFound = await regularPackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if (packageFound) {
        packageFound.destroy()
        if (packageFound)
          return res.json({
            code: errorCodes.success,
          })
      }
    }
    if (Type === packageType.EXTREME) {
      const packageFound = await extremePackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if (packageFound) {
        packageFound.destroy()

        return res.json({
          code: errorCodes.success,
        })
      }
    }
    return res.json({
      statusCode: errorCodes.invalidPackage,
      error: 'package not found',
    })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const sendGift = async (req, res) => {
  try {
    const purchases = await purchasedPackage.findAll({
      where: { accountId: req.body.Account.id },
    })
    if (!purchases) {
      return { error: 'account did not purchase any packages' }
    }
    const activePackages = purchases.filter((account) => {
      return (
        account.status === packageStatus.ACTIVE &&
        account.packageType === packageType.REGULAR
      )
    })

    let total = 0
    for (package of activePackages) {
      total += parseInt(package.totalPoints)
    }
    if (total < req.points) {
      return {
        code: errorCodes.insufficientPoints,
        error: 'insufficient points',
      }
    }
    const reciever = await accountsModel.findOne({
      where: { email: req.body.email },
    })
    if (reciever) {
      const gift = await regularPackage.findOne({
        where: { packageName: 'gift1111' },
      })

      giftId = gift.id
      const deductMessage = await deductPoints(
        req.body.Account.id,
        req.body.points
      )
      console.log(deductMessage)
      if (deductMessage.code !== errorCodes.success) {
        return res.json({
          code: errorCodes.unknown,
          error: 'problem in deduction',
        })
      }

      const addMessage = await addPoints(
        reciever.id,
        packageType.REGULAR,
        giftId,
        req.body.points
      )
      if (addMessage.code !== errorCodes.success) {
        return res.json({
          code: errorCodes.unknown,
          error: 'problem in addition',
        })
      }
      return res.json({
        code: errorCodes.success,
      })
    }
    const code = await generateOTP()
    const body = {}
    body.otpCode = code
    body.status = otpStatus.AVAILABLE
    body.points = req.body.points
    await giftOtp.create(body)
    return res.json({
      code: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const redeemGift = async (req, res) => {
  code = req.body.otpCode
  accountId = req.body.Account.id
  const gift = await regularPackage.findOne({
    where: { packageName: 'gift1111' },
  })
  otpCode = await giftOtp.findOne({ where: { otpCode: code } })
  if (!otpCode) {
    return { code: errorCodes.invalidOtp, error: 'invalid otp' }
  }

  giftOtp.update({ status: otpStatus.USED }, { where: { otpCode: code } })

  giftId = gift.id

  const addMessage = await addPoints(
    accountId,
    packageType.REGULAR,
    giftId,
    giftOtp.points
  )
  if (addMessage.code !== errorCodes.success) {
    return res.json({ code: errorCodes.unknown, error: 'problem in addition' })
  }
  return res.json({
    code: errorCodes.success,
  })
}

module.exports = {
  createPackage,
  purchasePackage,
  cancelPackage,
  createPackage,
  editPackage,
  viewPackage,
  viewMyPackages,
  deletePackage,
  redeemGift,
  sendGift,
  viewAllExtremePackages,
  viewAllRegularPackages,
}
