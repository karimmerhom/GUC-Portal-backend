const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { accountStatus, paymentMethods } = require('../api/constants/TBH.enum')

const Account = require('./account.model')

const { Model } = Sequelize

class booking extends Model {}
booking.init(
  {
    date: {
      type: Sequelize.DATE
    },
    slot: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    roomType: {
      type: Sequelize.ENUM,
      values: [
        'meeting room',
        'training room',
        'private office',
        'virtual office'
      ]
    },
    roomNumber: {
      type: Sequelize.ENUM,
      values: ['1', '2', '3', '4']
    },
    amountOfPeople: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.FLOAT
    },
    paymentMethod: {
      type: Sequelize.ENUM,
      values: [paymentMethods.CASH, paymentMethods.FAWRY, paymentMethods.CC]
    },
    packageCode: {
      type: Sequelize.STRING
    },
    datecreated: {
      type: Sequelize.DATE
    },
    dateModified: {
      type: Sequelize.DATE
    },
    dateDeleted: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.ENUM,
      values: [
        accountStatus.CANCELED,
        accountStatus.CONFIRMED,
        accountStatus.PENDING
      ]
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

booking.belongsTo(Account, {
  foreignKey: 'accountId',
  targetKey: 'id'
})

module.exports = booking
