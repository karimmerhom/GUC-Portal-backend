const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { accountStatus, userTypes } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class lirtenHubAccounts extends Model {}
lirtenHubAccounts.init(
  {
    accountID: {
      type: Sequelize.INTEGER,
    },
    lirtenAccountId: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = lirtenHubAccounts
