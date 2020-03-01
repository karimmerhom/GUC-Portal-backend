const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

class calendar extends Model {}
calendar.init(
  {
    date: {
      type: Sequelize.DATE
    },
    dayNumber: {
      type: Sequelize.INTEGER
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
    monthNumber: {
      type: Sequelize.INTEGER
    },
    year: {
      type: Sequelize.INTEGER
    },
    slot: {
      type: Sequelize.STRING,
      values: [
        '09AM',
        '10AM',
        '11AM',
        '12PM',
        '01PM',
        '02PM',
        '03PM',
        '04PM',
        '05PM',
        '06PM',
        '07PM',
        '08PM',
        '09PM'
      ]
    },
    status: {
      type: Sequelize.ENUM,
      values: ['Busy', 'Free', 'Pending']
    },
    roomNumber: {
      type: Sequelize.ENUM,
      values: ['1', '2', '3', '4']
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = calendar
