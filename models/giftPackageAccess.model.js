const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')
const { ability } = require('../api/constants/TBH.enum')

const { Model } = Sequelize

class giftPackageAccess extends Model {}
giftPackageAccess.init(
  {
    gifting: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)

module.exports = giftPackageAccess
