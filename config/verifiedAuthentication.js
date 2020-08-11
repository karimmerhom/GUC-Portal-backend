const jwt = require('jsonwebtoken')

const { secretOrKey } = require('./keys')

const { authentication, unVerified } = require('../api/constants/errorCodes')
const { accountStatus } = require('../api/constants/TBH.enum')

module.exports = {
  verifiedPhone: (req, res, next) => {
    jwt.verify(
      req.headers.authorization,
      secretOrKey,
      (err, authorizedData) => {
        if (!err) {
          const header = req.headers.authorization
          const token = header
          console.log(authorizedData.status)
          if (authorizedData.status === accountStatus.VERIFIED) {
            req.data = authorizedData
            req.token = token
            return next()
          }
          return res.json({
            code: unVerified,
            error: 'Phone number is not verified',
          })
        }
        return res.json({ code: authentication, error: 'breach' })
      }
    )
  },
}
