const cron = require('cron')
const purchasedPackage = require('../../models/purchasedPackages.model')
const extremePackage = require('../../models/extremePackage.model')
const regularPackage = require('../../models/regularPackage.model')
const purchases = require('../../models/purchases.model')
const boolExpirePackage = require('../../models/packageExpiration.model')
const errorCodes = require('../constants/errorCodes')
const { packageStatus, packageType, ability } = require('../constants/TBH.enum')

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

Date.prototype.addHours = function (hours) {
  var date = new Date(this.valueOf())
  date.setHours(date.getHours() + hours)
  return date
}

Date.prototype.addMins = function (mins) {
  var date = new Date(this.valueOf())
  date.setMinutes(date.getMinutes() + mins)
  return date
}

const generateOTP = async () => {
  let text = ''
  const possible = 'abcdefghijkmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const deductPoints = async (accountId, points) => {
  const purchase = await purchasedPackage.findAll({
    where: { accountId: accountId },
  })
  if (!purchase) {
    return { error: 'account did not purchase any packages' }
  }
  const activePackages = purchase.filter(
    (account) =>
      account.status === packageStatus.ACTIVE &&
      account.packageType === packageType.REGULAR
  )
  let total = 0
  for (package of activePackages) {
    total += parseInt(package.totalPoints)
  }
  if (total < points) {
    return { error: 'not enough points to be deducted' }
  }
  activePackages.sort(function (a, b) {
    var dateA = new Date(a.expiryDate),
      dateB = new Date(b.expiryDate)
    return dateA - dateB
  })
  for (package of activePackages) {
    const availablePoints =
      parseInt(package.totalPoints) - parseInt(package.usedPoints)
    if (availablePoints > points) {
      purchasedPackage.update(
        { usedPoints: parseInt(package.usedPoints) + parseInt(points) },
        { where: { id: package.id } }
      )

      break
    }
    purchasedPackage.update(
      { usedPoints: parseInt(package.totalPoints) },
      { where: { id: package.id } }
    )
    purchasedPackage.update(
      { status: 'expired' },
      { where: { id: package.id } }
    )

    points -= availablePoints
  }
  return { statusCode: errorCodes.success }
}

const refund = async (accountId, points) => {
  const purchase = await purchasedPackage.findAll({
    where: { accountId: accountId },
  })
  if (!purchase) {
    return { error: 'account did not purchase any packages' }
  }
  const activePackages = purchase.filter(
    (account) =>
      account.status === packageStatus.ACTIVE &&
      account.packageType === packageType.REGULAR
  )
  let used = 0
  for (package of activePackages) {
    used += parseInt(package.usedPoints)
  }

  const gift = await regularPackage.findOne({
    where: { packageName: 'gift' },
  })

  giftId = gift.id

  if (parseInt(used) < parseInt(points)) {
    return await addPoints(accountId, packageType.REGULAR, giftId, points)
  }
  activePackages.sort(function (a, b) {
    var dateA = new Date(a.expiryDate),
      dateB = new Date(b.expiryDate)
    return dateA - dateB
  })
  activePackages.reverse()

  for (package of activePackages) {
    const availablePoints = parseInt(package.usedPoints)
    if (availablePoints > points) {
      await purchasedPackage.update(
        { usedPoints: parseInt(package.usedPoints) - parseInt(points) },
        { where: { id: package.id } }
      )
      // package.usedPoints = parseInt(package.usedPoints) + parseInt(points)
      break
    }
    await purchasedPackage.update(
      { usedPoints: 0 },
      { where: { id: package.id } }
    )

    // package.usedPoints = parseInt(package.totalPoints)
    points -= availablePoints
  }
  return { statusCode: errorCodes.success}
}

const addPoints = async (accountId, type, packageId, points = 0) => {
  try {
    const body = {}
    body.packageType = type
    body.accountId = accountId
    body.packageId = packageId

    if (body.packageType === packageType.REGULAR) {
      const packageBody = await regularPackage.findByPk(packageId)
      if (!packageBody) {
        return {
          statusCode: errorCodes.invalidPackage,
          error: 'package does not exist',
        }
      }

      if (points === 0) {

        body.status = packageStatus.PENDING
        body.totalPoints = packageBody.points
      } else {
        body.status = packageStatus.ACTIVE
        body.totalPoints = points
      }
      body.usedPoints = 0
      body.purchaseDate = new Date().addHours(2)

      body.expiryDate = body.purchaseDate.addDays(packageBody.expiryDuration)
      const package = await purchasedPackage.create(body)
      packageId = package.id

      const scheduleJob = cron.job(body.expiryDate, async () => {
        await expirePackage(packageId)
      })
      scheduleJob.start()
      return {
        packageId : packageId,
        statusCode: errorCodes.success,

      }
    }
    if (type === packageType.EXTREME) {
      const packageBody = await extremePackage.findByPk(packageId)
      if (!packageBody) {
        return {
          statusCode: errorCodes.invalidPackage,
          error: 'package does not exist',
        }
      }
      body.purchaseDate = new Date().addHours(2)
      body.expiryDate = body.purchaseDate.addDays(packageBody.expiryDuration)
      body.status = packageStatus.PENDING
      const package = await purchasedPackage.create(body)
      packageId = package.id
      const scheduleJob = cron.job(body.expiryDate, async () => {
        await expirePackage(packageId)
      })
      scheduleJob.start()
      return {
        packageId: packageId,
        statusCode: errorCodes.success,
        error: 'success',
      }
    }

    return {
      statusCode: errorCodes.unknown,
      error: 'Package Type not found',
    }
  } catch (exception) {
    console.log(exception)
    return { statusCode: errorCodes.unknown, error: 'failed to add points' }
  }
}
const createPurchase = async (accountId, textArray, price) => {
  try {
    const body = {}
    body.accountId = accountId
    var narrativeValue = ''
    for (i = 0; i < textArray.length; i++) {
      narrativeValue += textArray[i] + ' '
    }
    body.narrative = narrativeValue
    body.price = price
    await purchases.create(body)
  } catch (exception) {
    return { code: errorCodes.unknown, error: 'failed to add purchase' }
  }
}

const expirePackage = async (packageId) => {
  const bool = await boolExpirePackage.findOne({})
  if (bool.expiry === ability.TRUE) {
    const body = {}
    body.status = packageStatus.EXPIRED
    await purchasedPackage.update(body, { where: { id: packageId } })
  }
}

module.exports = {
  generateOTP,
  deductPoints,
  addPoints,
  refund,
  createPurchase,
}
