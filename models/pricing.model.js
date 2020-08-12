const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Pricing extends Model {}
Pricing.init(
  {
    pricingType: {
      type: Sequelize.STRING,
    },
    roomType: {
      type: Sequelize.STRING,
    },
    value: {
      type: Sequelize.INTEGER,
    },
    unit: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = Pricing
