const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const userModel = require('./account.model')

const { Model } = Sequelize

class verifcationCodes extends Model {}
verifcationCodes.init(
  {
    emailCode: {
      type: Sequelize.STRING,
    },
    smsCode: {
      type: Sequelize.STRING,
    },
    emailDate: {
      type: Sequelize.DATE,
    },
    smsDate: {
      type: Sequelize.DATE,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

verifcationCodes.belongsTo(userModel, { foreignKey: 'accountId' })

module.exports = verifcationCodes
