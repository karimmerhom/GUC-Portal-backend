const { authentication } = require('../../constants/errorCodes')
const { userTypes } = require('../../constants/GUC.enum')

module.exports = {
  verifyUser: (req, res, next) => {
    try {
      const { Account } = req.body
      if (!Account) {
        return res.json({ code: authentication, error: 'breach not account' })
      }

      if (req.data.academicId !== Account.academicId) {
        return res.json({
          code: authentication,
          error: 'Not your academic id breach',
        })
      }
      return next()
    } catch (exception) {
      console.log(exception)
      return res.json({ code: authentication, error: 'breach exception' })
    }
  },
}
