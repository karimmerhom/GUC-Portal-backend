const organization = require('../../models/organization.model')
const accountsModel = require('../../models/account.model')
const roles = require('../../models/roles.model')
const { role } = require('../constants/TBH.enum')
const errorCodes = require('../constants/errorCodes')

const createOrganization = async (req, res) => {
  try {
    const owner = req.body.Account.id
    const name = req.body.organizationName
    const members = req.body.Members
    const org = await organization.create({ Name: name, points: 0 })
    roles.create({ accountId: owner, role: role.OWNER, organizationId: org.id })
    if (members) {
      members.map(async (member) => {
        const account = await accountsModel.findOne({
          where: {
            email: member.email,
          },
        })
        if (!account) {
          return res.json({
            statusCode: errorCodes.accountDoesNotExist,
            error: 'Member email does not exsist',
          })
        }
        roles.create({
          accountId: account.id,
          role: member.role,
          organizationId: org.id,
        })
      })
    }
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}
module.exports = { createOrganization }
