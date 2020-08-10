const bcrypt = require('bcryptjs')
const axios = require('axios')
const AccountModel = require('../models/account.model')
const errorCodes = require('../api/constants/errorCodes')
const { contactAccessKey } = require('../config/keys')
const { accountStatus, userTypes } = require('../api/constants/TBH.enum')

const populate_users = async () => {
  return { code: errorCodes.success }
}

module.exports = { populate_users }
