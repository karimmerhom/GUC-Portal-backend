const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Room extends Model {}
Room.init(
  {
    roomNumber: {
      type: Sequelize.NUMBER,
    },
    roomType: {
      type: Sequelize.STRING,
    },
    roomSize: {
      type: Sequelize.STRING,
    },
    roomImageUrl: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = Room
