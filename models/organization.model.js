const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

class Organization extends Model {}
Organization.init(
  {
    Name: {
      type: Sequelize.STRING,
    },
    points: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
)

module.exports = Organization
