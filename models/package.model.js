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
    remaining: {
      type: Sequelize.FLOAT
    },
    status: {
      type: Sequelize.ENUM,
      values: [
        accountStatus.ACTIVE,
        accountStatus.USED,
        accountStatus.CANCELED,
        accountStatus.PENDING
      ]
    },
    package: {
      type: Sequelize.ENUM,
      values: [
        'MRSG10',
        'MRSG30',
        'MRSG50',
        'TRSG10',
        'TRSG30',
        'TRSG50',
        'MRLG10',
        'MRLG30',
        'MRLG50',
        'TRLG10',
        'TRLG30',
        'TRLG50',
        'MRFRSG',
        'MRFRLG',
        'TRFRSG',
        'TRFRLG',
        'custom'
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
