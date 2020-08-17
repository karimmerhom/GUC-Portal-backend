const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { roomSize, roomType } = require('../api/constants/TBH.enum')

const UserModel = require('./account.model')
const RoomModel = require('./room.model')
const purchasedPackagesModel = require('./purchasedPackages.model')

const { Model } = Sequelize

class bookingExtreme extends Model {}
bookingExtreme.init(
  {
    startDate: {
      type: Sequelize.DATE,
    },
    endDate: {
      type: Sequelize.DATE,
    },
    roomNumber: { type: Sequelize.STRING },
    roomType: {
      type: Sequelize.STRING,
    },
    roomSize: {
      type: Sequelize.STRING,
    },
    roomLayout: {
      type: Sequelize.STRING,
    },
    duration: {
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
bookingExtreme.belongsTo(purchasedPackagesModel, { foreignKey: 'purchasedId' })
bookingExtreme.belongsTo(UserModel, { foreignKey: 'accountId' })
bookingExtreme.belongsTo(RoomModel, { foreignKey: 'roomId' })

module.exports = bookingExtreme
