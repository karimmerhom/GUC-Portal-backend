const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { accountStatus, paymentMethods } = require('../api/constants/TBH.enum')

const Account = require('./account.model')

const { Model } = Sequelize

class package extends Model {}
package.init(
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
      values: [accountStatus.ACTIVE, accountStatus.USED]
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

package.belongsTo(Account, {
  foreignKey: 'accountId',
  targetKey: 'id'
})

module.exports = booking
