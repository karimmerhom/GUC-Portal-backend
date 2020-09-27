const Sequelize = require('sequelize')

const sequelize = require('../config/DBConfig')

const { role } = require('../api/constants/TBH.enum')

const UserModel = require('./account.model')
const OrganizationModel = require('./organization.model')

const { Model } = Sequelize

class Roles extends Model {}
Roles.init(
  {
    role: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
)
Roles.belongsTo(UserModel, { foreignKey: 'accountId' })
Roles.belongsTo(OrganizationModel, { foreignKey: 'organizationId' })

module.exports = Roles
