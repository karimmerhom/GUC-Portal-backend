const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')
const { ability } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class packageExpiration extends Model {}
packageExpiration.init(
  {
    
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

module.exports = packageExpiration