const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

class giftOtp extends Model {}
giftOtp.init(
  {
    otpCode: {
      type: Sequelize.STRING,
    },
    points: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = giftOtp
