const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { accountStatus, userTypes } = require('../api/constants/TBH.enum')

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
      values: [accountStatus.VERIFIED, accountStatus.PENDING, accountStatus.SUSPENDED]
    },
    verificationCode: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.ENUM,
      values: [userTypes.ADMIN, userTypes.USER]
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = Account
