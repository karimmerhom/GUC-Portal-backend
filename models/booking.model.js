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
      type: Sequelize.DATE,
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
    price: {
      type: Sequelize.STRING,
    },
    paymentMethod: {
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
