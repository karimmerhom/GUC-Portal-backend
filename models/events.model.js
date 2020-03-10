const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { invitationStatus } = require('../api/constants/TBH.enum')

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
    },
    state: {
      type: Sequelize.ENUM,
      values: [
        invitationStatus.ACCEPTED,
        invitationStatus.REJECTED,
        invitationStatus.PENDING
      ],
      defaultValue: invitationStatus.PENDING
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
