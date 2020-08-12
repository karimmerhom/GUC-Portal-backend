const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const UserModel = require('./account.model')

const { Model } = Sequelize

class Courses extends Model {}
Courses.init(
  {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    attachedMedia: {
      type: Sequelize.STRING,
    },
    durationInHours: {
      type: Sequelize.DOUBLE,
    },
    daysPerWeek: {
      type: Sequelize.INTEGER,
    },
    sessionDuration: {
      type: Sequelize.DOUBLE,
    },
    pricePerPerson: {
      type: Sequelize.DOUBLE,
    },
    maxNumberOfAttendees: {
      type: Sequelize.INTEGER,
    },
    minNumberOfAttendees: {
      type: Sequelize.INTEGER,
    },
  },
  { sequelize, timestamps: false }
)

Courses.belongsTo(UserModel, { foreignKey: 'accountId' })

module.exports = Courses
