const pricingModel = require('../models/pricing.model')
const errorCodes = require('../api/constants/errorCodes')

const populate_pricing = async () => {
  await pricingModel.create({
    pricingId: 1,
    code: 'MRSG10',
    hoursRangeFrom: 10,
    hoursRangeTo: 29,
    price: 90,
    roomType: 'meeting room',
    description: 'Meeting Room Small Group from 10 to 29 hours'
  })
  await pricingModel.create({
    pricingId: 2,
    code: 'MRSG30',
    hoursRangeFrom: 30,
    hoursRangeTo: 49,
    price: 80,
    roomType: 'meeting room',
    description: 'Meeting Room Small Group from 30 to 49 hours'
  })
  await pricingModel.create({
    pricingId: 3,
    code: 'MRSG50',
    hoursRangeFrom: 50,
    price: 70,
    roomType: 'meeting room',
    description: 'Meeting Room Small Group 50+ Hrs'
  })
  await pricingModel.create({
    pricingId: 4,
    code: 'TRSG10',
    hoursRangeFrom: 10,
    hoursRangeTo: 29,
    price: 180,
    roomType: 'training room',
    description: 'Training Room Small Group from 10 to 29 hours. '
  })
  await pricingModel.create({
    pricingId: 5,
    code: 'TRSG30',
    hoursRangeFrom: 30,
    hoursRangeTo: 49,
    price: 170,
    roomType: 'training room',
    description: 'Training Room Small Group from 30 to 49 hours'
  })
  await pricingModel.create({
    pricingId: 6,
    code: 'TRSG50',
    hoursRangeFrom: 50,
    price: 150,
    roomType: 'training room',
    description: 'Training Room Small Group 50+ Hrs'
  })
  await pricingModel.create({
    pricingId: 7,
    code: 'MRLG10',
    hoursRangeFrom: 10,
    hoursRangeTo: 29,
    price: 160,
    roomType: 'meeting room',
    description: 'Meeting Room Large Group from 30 to 49 hours. '
  })
  await pricingModel.create({
    pricingId: 8,
    code: 'MRLG30',
    hoursRangeFrom: 30,
    hoursRangeTo: 49,
    price: 150,
    roomType: 'meeting room',
    description: 'Meeting Room Large Group from 30 to 49 hours. '
  })
  await pricingModel.create({
    pricingId: 9,
    code: 'MRLG50',
    hoursRangeFrom: 50,
    price: 140,
    roomType: 'meeting room',
    description: 'Meeting Room Large Group from 30 to 49 hours.'
  })
  await pricingModel.create({
    pricingId: 10,
    code: 'TRLG10',
    hoursRangeFrom: 10,
    hoursRangeTo: 29,
    price: 280,
    roomType: 'training room',
    description: 'Training Room Large Group from 10 to 29 hours'
  })
  await pricingModel.create({
    pricingId: 11,
    code: 'TRLG30',
    hoursRangeFrom: 30,
    hoursRangeTo: 49,
    price: 270,
    roomType: 'training room',
    description: 'Training Room Large Group from 10 to 29 hours'
  })
  await pricingModel.create({
    pricingId: 12,
    code: 'TRLG50',
    hoursRangeFrom: 50,
    price: 250,
    roomType: 'training room',
    description: 'Training Room Large Group from 10 to 29 hours'
  })
  await pricingModel.create({
    pricingId: 13,
    code: 'MRFRSG',
    price: 100,
    roomType: 'meeting room',
    description: 'Meeting Room Flat Rate Small Group'
  })
  await pricingModel.create({
    pricingId: 14,
    code: 'MRFRLG',
    price: 170,
    roomType: 'meeting room',
    description: 'Meeting Room Flat Rate Large Group'
  })
  await pricingModel.create({
    pricingId: 15,
    code: 'TRFRSG',
    price: 200,
    roomType: 'training room',
    description: 'Training Room Flat Rate Small Group'
  })
  await pricingModel.create({
    pricingId: 16,
    code: 'TRFRLG',
    price: 300,
    roomType: 'training room',
    description: 'Training Room Flat Rate Large Group'
  })
  return { code: errorCodes.success }
}

module.exports = { populate_pricing }
