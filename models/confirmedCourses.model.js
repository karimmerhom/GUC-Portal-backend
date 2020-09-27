const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const UserModel = require('./account.model')

const { Model } = Sequelize

class confirmedCourses extends Model {}
confirmedCourses.init(
  {
    title: {
      type: Sequelize.STRING,
    },

    eventTitle: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    attachedMediaIn: {
      type: Sequelize.STRING,
    },
    attachedMediaOut: {
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
    numberOfSessions: {
      type: Sequelize.INTEGER,
    },
    startDate: {
      type: Sequelize.STRING,
    },
    endDate: {
      type: Sequelize.STRING,
    },
    dateCreated: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.DOUBLE,
    },
    maxNumberOfAttendees: {
      type: Sequelize.INTEGER,
    },
    minNumberOfAttendees: {
      type: Sequelize.INTEGER,
    },
    teacherName: {
      type: Sequelize.STRING,
    },
    
    status: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
  },
  { sequelize, timestamps: false }
)

confirmedCourses.belongsTo(UserModel, { foreignKey: 'accountId' })

module.exports =  confirmedCourses
