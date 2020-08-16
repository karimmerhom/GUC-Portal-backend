const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Pending extends Model {}
Pending.init(
  {
    pendingType: {
      type: Sequelize.STRING,
    },
    value: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = Pending
