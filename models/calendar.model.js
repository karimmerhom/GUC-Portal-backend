const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Calendar extends Model {}
Calendar.init(
  {
    roomNumber: {
      type: Sequelize.INTEGER,
      unique: true,
    },
    date: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.STRING,
    },
    slot: {
      type: Sequelize.STRING,
    },
    bookingId: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = Calendar
