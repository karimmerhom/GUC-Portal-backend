const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const UserModel = require('./account.model')
const RoomModel = require('./room.model')

const { Model } = Sequelize

class Booking extends Model {}
Booking.init(
  {
    date: {
      type: Sequelize.STRING,
    },
    expiryDate: {
      type: Sequelize.STRING,
    },
    slots: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    roomType: {
      type: Sequelize.STRING,
    },

    roomSize: {
      type: Sequelize.STRING,
    },
    roomLayout: {
      type: Sequelize.STRING,
    },
    pricePoints: {
      type: Sequelize.STRING,
    },
    priceCash: {
      type: Sequelize.STRING,
    },
    paymentMethod: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
)
Booking.belongsTo(UserModel, { foreignKey: 'accountId' })
Booking.belongsTo(RoomModel, { foreignKey: 'roomId' })

module.exports = Booking
