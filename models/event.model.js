const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { invitationStatus, accountStatus } = require('../api/constants/TBH.enum')

const { Model } = Sequelize
const AccountModel = require('./account.model')

class Event extends Model {}
Event.init(
  {
    name: {
      type: Sequelize.STRING
    },
    dateFrom: {
      type: Sequelize.DATE
    },
    dateTo: {
      type: Sequelize.DATE
    },
    description: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.FLOAT
    },
    state: {
      type: Sequelize.ENUM,
      values: [invitationStatus.ACCEPTED, accountStatus.CANCELED],
      defaultValue: invitationStatus.ACCEPTED
    },
    services: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    link: {
      type: Sequelize.STRING
    },
    roomLayout: {
      type: Sequelize.STRING
    },
    amountOfPeople: {
      type: Sequelize.INTEGER
    },
    maxNoOfPeople: {
      type: Sequelize.INTEGER
    },
    collaborators: {
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    facebookPage: {
      type: Sequelize.STRING
    },
    instagramPage: {
      type: Sequelize.STRING
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = Event
