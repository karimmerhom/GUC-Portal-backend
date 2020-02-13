const { authentication } = require('../api/constants/errorCodes')
const { userTypes } = require('../api/constants/TBH.enum')

module.exports = {
  verifyUser: (req, res, next) => {
    try {
      const { Account } = req.body
      if (!Account) {
        return res.json({ code: authentication, error: 'breach' })
      }
      if (req.data.id !== Account.id && req.data.userType !== userTypes.ADMIN) {
        return res.json({ code: authentication, error: 'breach' })
      }
      return next()
    } catch (exception) {
      return res.json({ code: authentication, error: 'breach' })
    }
  }
}
