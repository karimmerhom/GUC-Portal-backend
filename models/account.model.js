const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { accountStatus, gender } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Account extends Model {}
Account.init(
  {
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      values: [accountStatus.VERIFIED, accountStatus.PENDING]
    },
    verificationCode: {
      type: Sequelize.STRING
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = Account
