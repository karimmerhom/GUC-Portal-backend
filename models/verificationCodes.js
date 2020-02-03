const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

class verificationCode extends Model {}
verificationCode.init(
  {
    code: {
      type: Sequelize.STRING
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

module.exports = verificationCode
