const jwt = require('jsonwebtoken')

const { secretOrKey } = require('./keys')

const { authentication, unVerified } = require('../api/constants/errorCodes')
const { accountStatus } = require('../api/constants/TBH.enum')
module.exports = {
  verifiedPhone: (req, res, next) => {
    try {
      const { Account } = req.body
      if (!Account) {
        return res.json({ code: authentication, error: 'breach not account' })
      }
      console.log(req.data)
      if (req.data.status !== accountStatus.VERIFIED) {
        return res.json({ code: unVerified, error: 'PhoneNumber not verified' })
      }
      return next()
    } catch (exception) {
      console.log(exception)
      return res.json({ code: authentication, error: 'breach exception' })
    }
  },
}
