const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const {
  accountStatus,
  paymentMethods,
  gender,
} = require('../api/constants/TBH.enum')

const UserModel = require('./account.model')
const { Model } = Sequelize

class PurchasePackage extends Model {}
PurchasePackage.init(
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
      type: Sequelize.STRING,
    },
    expiryDate: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    packageType: {
      type: Sequelize.STRING,
    },
    packageName: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)
PurchasePackage.belongsTo(UserModel, { foreignKey: 'accountId' })

module.exports = PurchasePackage
