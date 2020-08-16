const Sequelize = require('sequelize')
const sequelize = require('../config/DBConfig')

const { Model } = Sequelize
const UserModel = require('./account.model')
class Form extends Model {}
Form.init(
  {
    degree: {
      type: Sequelize.STRING,
    },
    university: {
      type: Sequelize.STRING,
    },
    yearOfGraduation: {
      type: Sequelize.DATE,
    },
    CV: {
      type: Sequelize.STRING,
    },
    englishLevel: {
      type: Sequelize.STRING,
    },
    previousOrganizingExperience: {
      type: Sequelize.STRING,
    },
    placesOrganizedAtPreviously: {
      type: Sequelize.STRING,
    },
  },
  { sequelize, timestamps: false }
)

Form.belongsTo(UserModel, { foreignKey: 'accountId' })

module.exports = Form
