const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')
const { ability } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class giftPackageAccess extends Model {}
giftPackageAccess.init(
  {
  
    accountId: {
      type: Sequelize.STRING
    },
    ability : {
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

module.exports = giftPackageAccess