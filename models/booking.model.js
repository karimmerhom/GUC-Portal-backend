const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Booking extends Model {}
Booking.init(
  {
    accountId: {
      type: Sequelize.String,
    },
    date: {
      type: Sequelize.DATE,
    },
    slot: {
      type: Sequelize.ARRAY,
    },
    roomType: {
      type: Sequelize.STRING,
    },
    roomNumber: {
      type: Sequelize.STRING,
    },
    roomSize: {
      type: Sequelize.STRING,
    },
    roomLayout: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.STRING,
    },
    paymentMethod: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
)

module.exports = Booking
