const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { invitationStatus } = require('../api/constants/TBH.enum')

const { Model } = Sequelize
const AccountModel = require('./account.model')

class Registeration extends Model {}
Registeration.init(
  {
    state: {
      type: Sequelize.ENUM,
      values: [
        invitationStatus.PENDING,
        invitationStatus.REGISTERED,
        invitationStatus.REJECTED
      ],
      defaultValue: invitationStatus.PENDING
    },
    eventId: {
      type: Sequelize.INTEGER
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

Registeration.belongsTo(AccountModel, {
  foreignKey: 'accountId',
  targetKey: 'id'
})

module.exports = Registeration
