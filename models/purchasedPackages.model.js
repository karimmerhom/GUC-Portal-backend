const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const {
  accountStatus,
  paymentMethods,
  gender,
} = require('../api/constants/TBH.enum')

const UserModel = require('./account.model')
const { Model } = Sequelize

class Purchase extends Model {}
Purchase.init(
  {
    packageId: {
      type: Sequelize.STRING,
    },
    totalPoints: {
      type: Sequelize.STRING,
    },
    usedPoints: {
      type: Sequelize.STRING,
    },
    purchaseDate: {
      type: Sequelize.DATE,
    },
    expiryDate: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.STRING,
    },
    packageType: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)
Purchase.belongsTo(UserModel, { foreignKey: 'accountId' })

module.exports = Purchase
