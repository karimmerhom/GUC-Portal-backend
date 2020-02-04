const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

class calendar extends Model {}
calendar.init(
  {
    dayName: {
      type: Sequelize.ENUM,
      values: [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ]
    },
    dayNumber: {
      type: Sequelize.FLOAT
    },
    month: {
      type: Sequelize.ENUM,
      values: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    },
    slot: {
      type: Sequelize.FLOAT
    },
    status: {
      type: Sequelize.ENUM,
      values: ['Busy', 'Free']
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = calendar
