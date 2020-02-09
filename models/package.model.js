const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { accountStatus } = require('../api/constants/TBH.enum')

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
    package: {
      type: Sequelize.ENUM,
      values: [
        'meeting room 5',
        'meeting room 10',
        'training room 7',
        'training room 16'
      ]
    },
    price: {
      type: Sequelize.FLOAT
    },
    roomType: {
      type: Sequelize.ENUM,
      values: ['meeting room', 'training room']
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
