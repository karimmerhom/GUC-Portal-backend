const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')
const { ability } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class bookingExpiration extends Model {}
bookingExpiration.init(
  {
    expiryPeriod: {
      type: Sequelize.INTEGER,
    },
    expiry : {
      type: Sequelize.ENUM,
      values: [
        ability.TRUE,
        ability.FALSE,
  
      ]
    },
  },
  {
    sequelize,
    timestamps: false
  }
)

module.exports = bookingExpiration