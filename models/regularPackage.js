const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

class regularPackage extends Model {}
regularPackage.init(
  {
  
    packageName: {
      type: Sequelize.STRING
    },
    expiryDuration: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.DOUBLE
    },
    points: {
      type: Sequelize.INTEGER
    },
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = regularPackage
