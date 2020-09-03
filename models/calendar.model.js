const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { bookingType } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class Calendar extends Model {}
Calendar.init(
  {
    roomNumber: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    slot: {
      type: Sequelize.STRING,
    },
    bookingId: {
      type: Sequelize.INTEGER,
    },
    bookingType: {
      type: Sequelize.STRING,
      defaultValue: bookingType.REGULAR,
    },
    accountId: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = Calendar
