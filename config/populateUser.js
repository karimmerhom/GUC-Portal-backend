const errorCodes = require('../api/constants/errorCodes')

const populate_users = async () => {
  return { code: errorCodes.success }
}

module.exports = { populate_users }
