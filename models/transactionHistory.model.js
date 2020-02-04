const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

const Account = require('./account.model')

class transactionHistory extends Model {}
transactionHistory.init(
  {
    amount: {
      type: Sequelize.FLOAT
    },
    date: {
      type: Sequelize.DATE
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

transactionHistory.belongsTo(Account, {
  foreignKey: 'accountId',
  targetKey: 'id'
})

module.exports = transactionHistory
