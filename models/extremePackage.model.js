const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { Model } = Sequelize

class ExtremePackage extends Model {}
ExtremePackage.init(
  {
  
    packageName: {
      type: Sequelize.STRING
    },
    expiryDuration: {
      type: Sequelize.INTEGER
    },
    largePrice: {
      type: Sequelize.DOUBLE
    },
    smallPrice: {
      type: Sequelize.DOUBLE
    },
    daysPerWeek: {
      type: Sequelize.INTEGER
    },
    
    startPeriod: {
      type: Sequelize.INTEGER
    },
    endPeriod: {
      type: Sequelize.INTEGER
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = ExtremePackage
