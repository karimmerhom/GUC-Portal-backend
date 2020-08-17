const Sequelize = require('sequelize')
const sequelize = require('../config/DBConfig')
const UserModel = require('./account.model')
const { Model } = Sequelize

class Purchases extends Model {}
Purchases.init(
  {
    narrative: {
      type: Sequelize.TEXT,
    },
    price: {
      type: Sequelize.DOUBLE,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)
Purchases.belongsTo(UserModel, { foreignKey: 'accountId' })

module.exports = Purchases
