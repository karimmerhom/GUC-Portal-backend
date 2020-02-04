const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

class calendar extends Model {}
calendar.init(
  {
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
      type: Sequelize.STRING
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
