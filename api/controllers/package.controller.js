const { emailAccessKey } = require('../../config/keys')
const extremePackage = require('../../models/extremePackage.model')
const bookingExtreme = require('../../models/bookingExtreme.model')
const CalendarModel = require('../../models/calendar.model')
const moment = require('moment')

const pendings = require('../../models/pending.model')
const axios = require('axios')
const regularPackage = require('../../models/regularPackage.model')
const purchasedPackage = require('../../models/purchasedPackages.model')
const accountsModel = require('../../models/account.model')
const purchasesModel = require('../../models/purchases.model')
const giftModel = require('../../models/giftOtp.model')
const {
  bookingStatus,
  packageStatus,
  packageType,
  otpStatus,
  pendingType,
  bookingType,
} = require('../constants/TBH.enum')
const errorCodes = require('../constants/errorCodes')
const {
  addPoints,
  generateOTP,
  refund,
  deductPoints,
  createPurchase,
} = require('../helpers/helpers')
const giftOtp = require('../../models/giftOtp.model')
const { Op } = require('sequelize')

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
          statusCode: errorCodes.success,
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
          statusCode: errorCodes.success,
        })
      }
    }
    return res.json({
      statusCode: errorCodes.nameExists,
      error: 'name already exists',
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
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
        stausCode: errorCodes.success,
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
        statusCode: errorCodes.success,
      })
    }
    return res.json({
      statusCode: errorCodes.invalidId,
      error: 'id does not exist',
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const purchasePackage = async (req, res) => {
  try {
    const Type = req.body.packageType
    const Id = req.body.packageId
    const accountId = req.body.Account.id
    const x = await Promise.all([
      purchasedPackage.findAll({
        where: { accountId: accountId },
      }),
      pendings.findOne({ where: { pendingType: pendingType.PACKAGES } }),
    ])

    if (x[0]) {
      const pendingPackages = x[0].filter(
        (account) => account.status === packageStatus.PENDING
      )
      if (pendingPackages.length + 1 > x[1].value) {
        return res.json({
          statusCode: errorCodes.pendingLimitExceeded,
          error: 'Exceeded number of pending packages',
        })
      }
    }

    const r = await addPoints(accountId, Type, Id)
    return res.json(r)
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const cancelPackage = async (req, res) => {
  try {
    if (!purchasedPackage.findOne({ where: { id: req.body.Account.id } })) {
      return res.json({
        statusCode: errorCodes.unknown,
        error: 'wrong account',
      })
    }

    const body = req.body
    const bodyId = req.body.packageId
    const package = await purchasedPackage.findByPk(bodyId)
    if (package.status === packageStatus.CANCELED) {
      return res.json({
        statusCode: errorCodes.packageCanceled,
        error: 'package already canceled',
      })
    }
    if (parseInt(package.accountId) !== parseInt(req.body.Account.id)) {
      return res.json({
        statusCode: errorCodes.unknown,
        error: 'package does not belong to user',
      })
    }
    body.status = packageStatus.CANCELED
    await purchasedPackage.update(body, { where: { id: bodyId } })
    return res.json({
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
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
        return res.json({
          package: packageFound,
          statusCode: errorCodes.success,
        })
    }
    if (Type === packageType.EXTREME) {
      const packageFound = await extremePackage.findOne({
        where: {
          id: parseInt(id),
        },
      })
      if (packageFound)
        return res.json({
          package: packageFound,
          statusCode: errorCodes.success,
        })
    }
    return res.json({
      statusCode: errorCodes.invalidPackage,
      error: 'package not found',
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const viewAllRegularPackages = async (req, res) => {
  try {
    const gift = 'gift'
    const packagesFound1 = await regularPackage.findAll({
      where: {
        packageName: { [Op.not]: gift },
      },
    })
    return res.json({ package: packagesFound1, statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const viewAllExtremePackages = async (req, res) => {
  try {
    const packagesFound2 = await extremePackage.findAll({})
    return res.json({ package: packagesFound2, statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const viewMyPackages = async (req, res) => {
  try {
    const purchases = await purchasedPackage.findAll({
      where: { accountId: req.body.Account.id },
    })

    let total = 0
    for (package of purchases) {
      total += parseInt(package.totalPoints)
    }
    return res.json({
      purchasedPackages: { purchases, total: total },
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const viewMyPurchases = async (req, res) => {
  try {
    const purchases = await purchasesModel.findAll({
      where: { accountId: req.body.Account.id },
    })
    return res.json({
      purchases,
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
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
            statusCode: errorCodes.success,
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
          statusCode: errorCodes.success,
        })
      }
    }
    return res.json({
      statusCode: errorCodes.invalidPackage,
      error: 'package not found',
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
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
        statusCode: errorCodes.insufficientPoints,
        error: 'insufficient points',
      }
    }
    const code = await generateOTP()
    const body = {}
    body.otpCode = code
    body.status = otpStatus.AVAILABLE
    body.points = req.body.points
    const reciever = await accountsModel.findOne({
      where: { email: req.body.email },
    })
    const gift = await regularPackage.findOne({
      where: { packageName: 'gift' },
    })

    giftId = gift.id
    const deductMessage = await deductPoints(
      req.body.Account.id,
      req.body.points
    )
    console.log(deductMessage)
    if (deductMessage.statusCode !== errorCodes.success) {
      return res.json({
        statusCode: errorCodes.unknown,
        error: 'problem in deduction',
      })
    }
    if (reciever) {
      const addMessage = await addPoints(
        reciever.id,
        packageType.REGULAR,
        giftId,
        req.body.points
      )
      if (addMessage.statusCode !== errorCodes.success) {
        return res.json({
          statusCode: errorCodes.unknown,
          error: 'problem in addition',
        })
      }
    } else {
      axios({
        method: 'post',
        url: 'https://dev.power-support.lirten.com/email/email/_send_email', //TODO
        data: {
          header: {
            accessKey: emailAccessKey,
          },
          body: {
            receiverMail: req.body.email,
            body: code,
            subject: 'Redeem Your Points',
          },
        },
      })
    }

    await giftOtp.create(body)
    return res.json({
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const redeemGift = async (req, res) => {
  code = req.body.otpCode
  accountId = req.body.Account.id
  const gift = await regularPackage.findOne({
    where: { packageName: 'gift' },
  })
  otpCode = await giftOtp.findOne({ where: { otpCode: code } })
  if (!otpCode) {
    return { statusCode: errorCodes.invalidOtp, error: 'invalid otp' }
  }

  giftOtp.update({ status: otpStatus.USED }, { where: { otpCode: code } })

  giftId = gift.id

  const addMessage = await addPoints(
    accountId,
    packageType.REGULAR,
    giftId,
    giftOtp.points
  )
  if (addMessage.statusCode !== errorCodes.success) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'problem in addition',
    })
  }
  return res.json({
    statusCode: errorCodes.success,
  })
}

const editStatus = async (req, res) => {
  try {
    const body = req.body
    const newStatus = req.body.status
    const bodyId = req.body.purchasedPackageId
    const package = await purchasedPackage.findByPk(bodyId)
    if (!package) {
      return res.json({ error: 'no such package' })
    }
    body.status = newStatus

    if (newStatus === packageStatus.ACTIVE) {
      if (package.status === packageStatus.ACTIVE) {
        return res.json({
          statusCode: errorCodes.unknown,
          error: 'package already active',
        })
      }
    }

    const accountId = package.accountId
    console.log(package.packageType)
    if (package.packageType === packageType.REGULAR) {
      const regPackage = await regularPackage.findByPk(package.packageId)
      const price = regPackage.price
      let text = [package.packageType, regPackage.points]
      console.log('in regular')
      createPurchase(accountId, text, price)
    }
    console.log(package.packageType)
    if (package.packageType === packageType.EXTREME) {
      console.log('extreme')
      const bookingrecord = await bookingExtreme.findOne({
        where: {
          purchasedId: bodyId,
        },
      })
      console.log(bookingrecord)
      if (bookingrecord) {
        const extPackage = await extremePackage.findByPk(package.packageId)
        const price = bookingrecord.price
        console.log(price)
        let size = ''

        if (extPackage.largePrice === price) {
          size = 'large group'
        }
        if (extPackage.smallPrice === price) {
          size = 'small group'
        }

        let text = [
          package.packageType,
          extPackage.packageName,
          size,
          moment(bookingrecord.startDate).format('ll'),
        ]
        await createPurchase(accountId, text, price)

        await bookingExtreme.update(
          { status: bookingStatus.CONFIRMED },
          { where: { id: bookingrecord.id } }
        )
        console.log('here1')
        await purchasedPackage.update(
          { status: packageStatus.ACTIVE },
          { where: { id: bookingrecord.purchasedId } }
        )
        console.log('here2')
        await CalendarModel.update(
          { status: bookingStatus.CONFIRMED },
          {
            where: {
              bookingId: bookingrecord.id,
              bookingType: bookingType.EXTREME,
            },
          }
        )
        console.log('here3')
      }
    } else {
      console.log('here updated')
      await purchasedPackage.update(
        { status: req.body.status },
        { where: { id: bodyId } }
      )
    }
    console.log('here outsidde')
    return res.json({
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
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
  editStatus,
  viewMyPurchases,
}
