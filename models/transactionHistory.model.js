const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

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
  foreignKey: 'id',
  targetKey: 'accountId'
})

module.exports = transactionHistory
