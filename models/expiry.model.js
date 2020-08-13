const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Expiry extends Model {}
Expiry.init(
  {
    duration: {
      type: Sequelize.INTEGER,
    },
    on_off: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = Expiry
