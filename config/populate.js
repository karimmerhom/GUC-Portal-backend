const errorCodes = require('../api/constants/errorCodes')
const Expiry = require('../models/expiry.model')
const ExtremePackage = require('../models/extremePackage.model')
const Pending = require('../models/pending.model')
const Pricing = require('../models/pricing.model')
const regularPackage = require('../models/regularPackage.model')
const GiftPackageAccess = require('../models/giftPackageAccess.model')
const packageExpiration = require('../models/packageExpiration.model')
const Room = require('../models/room.model')

const populate = async () => {
  await regularPackage.create({
    packageName: 'extreme',
    expiryDuration: 90,
    price: 2000,
    points: 330,
  })
  await regularPackage.create({
    packageName: 'starter',
    expiryDuration: 14,
    price: 500,
    points: 60,
  })
  await regularPackage.create({
    packageName: 'medium',
    expiryDuration: 30,
    price: 1500,
    points: 210,
  })
  await regularPackage.create({
    packageName: 'gift',
    expiryDuration: 7,
    price: 0,
    points: 50,
  })
  await ExtremePackage.create({
    packageName: 'A WEEK',
    expiryDuration: 7,
    largePrice: 3400,
    smallPrice: 2000,
    daysPerWeek: 5,
    startPeriod: 9,
    endPeriod: 7,
  })
  await ExtremePackage.create({
    packageName: 'A DAY',
    expiryDuration: 7,
    largePrice: 1050,
    smallPrice: 700,
    daysPerWeek: 1,
    startPeriod: 9,
    endPeriod: 7,
  })
  await ExtremePackage.create({
    packageName: 'WHOLE WEEK',
    expiryDuration: 7,
    largePrice: 5800,
    smallPrice: 3600,
    daysPerWeek: 6,
    startPeriod: 9,
    endPeriod: 10,
  })
  await ExtremePackage.create({
    packageName: 'WHOLE DAY',
    expiryDuration: 7,
    largePrice: 1500,
    smallPrice: 1000,
    daysPerWeek: 1,
    startPeriod: 9,
    endPeriod: 10,
  })
  await Expiry.create({
    duration: 2,
    on_off: 'on',
  })
  await Pending.create({
    pendingType: 'Packages',
    value: 100,
  })
  await Pending.create({
    pendingType: 'Bookings',
    value: 100,
  })
  await Pricing.create({
    pricingType: 'points',
    roomType: 'large group',
    value: 15,
    unit: 'points',
  })
  await Pricing.create({
    pricingType: 'points',
    roomType: 'small group',
    value: 10,
    unit: 'points',
  })
  await Pricing.create({
    pricingType: 'flat_rate',
    roomType: 'large group',
    value: 150,
    unit: 'egp',
  })
  await Pricing.create({
    pricingType: 'flat_rate',
    roomType: 'small group',
    value: 100,
    unit: 'egp',
  })
  await GiftPackageAccess.create({
    gifting: true,
  })
  await packageExpiration.create({
    expiry: true,
  })
  await Room.create({
    roomNumber: 1,
    roomType: 'meeting room',
    roomSize: 'large group',
    roomImageUrl: null,
  })
  await Room.create({
    roomNumber: 2,
    roomType: 'meeting room',
    roomSize: 'large group',
    roomImageUrl: null,
  })
  await Room.create({
    roomNumber: 3,
    roomType: 'meeting room',
    roomSize: 'large group',
    roomImageUrl: null,
  })
  await Room.create({
    roomNumber: 4,
    roomType: 'meeting room',
    roomSize: 'large group',
    roomImageUrl: null,
  })
  return { code: errorCodes.success }
}

module.exports = { populate }
