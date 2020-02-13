const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { accountStatus } = require('../api/constants/TBH.enum')

const Account = require('./account.model')

const { Model } = Sequelize

class pricing extends Model {}
pricing.init(
  {
    pricingId: {
      type: Sequelize.INTEGER
    },
    code: {
      type: Sequelize.STRING
    },
    hoursRangeFrom: {
      type: Sequelize.INTEGER
    },
    hoursRangeTo: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.FLOAT
    },
    roomType: {
      type: Sequelize.ENUM,
      values: ['meeting room', 'training room']
    },
    description: {
      type: Sequelize.STRING
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = pricing
