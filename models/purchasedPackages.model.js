const Sequelize = require("sequelize")

const sequelize = require("../config/DBConfig")

const {
  accountStatus,
  paymentMethods,
  gender,
} = require("../api/constants/TBH.enum")

const UserModel = require("./account.model")
const RegularPackageModel = require("./regularpackage.model")
const ExtremePackageModel = require("./extremepackage.model")
const { Model } = Sequelize

class Purchase extends Model {}
Purchase.init(
  {
    packageId: {
      type: Sequelize.STRING,
    },
    totalPoints: {
      type: Sequelize.STRING,
    },
    usedPoints: {
      type: Sequelize.STRING,
    },
    purchaseDate: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
)
Purchase.belongsTo(UserModel, { foreignKey: "accountId" })

module.exports = Purchase
