const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { invitationStatus } = require('../api/constants/TBH.enum')

const { Model } = Sequelize
const AccountModel = require('./account.model')

class Inivitation extends Model {}
Inivitation.init(
  {
    inviteeId: {
      type: Sequelize.INTEGER
    },
    state: {
      type: Sequelize.ENUM,
      values: [
        invitationStatus.ACCEPTED,
        invitationStatus.REJECTED,
        invitationStatus.PENDING
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

Inivitation.belongsTo(AccountModel, {
  foreignKey: 'accountId',
  targetKey: 'id'
})

module.exports = Inivitation
