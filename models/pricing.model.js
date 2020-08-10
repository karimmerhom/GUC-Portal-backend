const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Pricing extends Model {}
Pricing.init(
  {
    price: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = Pricing
