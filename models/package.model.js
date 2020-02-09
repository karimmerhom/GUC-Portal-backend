const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { accountStatus, paymentMethods } = require('../api/constants/TBH.enum')

const Account = require('./account.model')

const { Model } = Sequelize

class packageModel extends Model {}
packageModel.init(
  {
    code: {
      type: Sequelize.STRING
    },
    usage: {
      type: Sequelize.FLOAT
    },
    remaining: {
      type: Sequelize.FLOAT
    },
    status: {
      type: Sequelize.ENUM,
      values: [accountStatus.ACTIVE, accountStatus.USED, accountStatus.CANCELED]
    },
    name: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.FLOAT
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

packageModel.belongsTo(Account, {
  foreignKey: 'accountId',
  targetKey: 'id'
})

module.exports = packageModel
