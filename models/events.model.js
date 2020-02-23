const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize
const AccountModel = require('./account.model')

class Event extends Model {}
Event.init(
  {
    name: {
      type: Sequelize.STRING
    },
    dateFrom: {
      type: Sequelize.DATE
    },
    dateTo: {
      type: Sequelize.DATE
    },
    description: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.FLOAT
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

Event.belongsTo(AccountModel, {
  foreignKey: 'accountId',
  targetKey: 'id'
})

module.exports = Event
