const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { paymentMethods, accountStatus } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class purchases extends Model {}
purchases.init(
  {
    price: {
      type: Sequelize.FLOAT
    },
    date: {
      type: Sequelize.DATE
    },
    purchaseMethod: {
      type: Sequelize.ENUM,
      values: [paymentMethods.CASH, paymentMethods.VODAFONECASH]
    },
    name: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      values: [accountStatus.PENDING, accountStatus.CONFIRMED]
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = purchases
