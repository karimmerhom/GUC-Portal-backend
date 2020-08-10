const Sequelize = require("sequelize")

const sequelize = require("../config/DBConfig")

const {
  accountStatus,
  paymentMethods,
  gender,
} = require("../api/constants/TBH.enum")

const UserModel = require("./account.model")
const PackageModel = require("./packages.model")

const { Model } = Sequelize

class Purchased extends Model {}
Purchased.init(
  {
    packageId: {
      type: Sequelize.STRING,
    },
    packageType: {
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
Purchased.belongsTo(UserModel, { foreignKey: "accountId" })
Purchased.belongsTo(PackageModel, { foreignKey: "packageId" })

module.exports = Account
