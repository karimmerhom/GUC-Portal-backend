const { authentication } = require('../api/constants/errorCodes')
const { userTypes } = require('../api/constants/TBH.enum')

module.exports = {
  verifyUser: (req, res, next) => {
    try {
      const { Account } = req.body
      if (!Account) {
        return res.json({ code: authentication, error: 'breach not account' })
      }
      if (
        req.data.id !== parseInt(Account.id) &&
        req.data.type !== userTypes.ADMIN
      ) {
        return res.json({ code: authentication, error: 'breach breach' })
      }
      return next()
    } catch (exception) {
      return res.json({ code: authentication, error: 'breach exception' })
    }
  }
}
