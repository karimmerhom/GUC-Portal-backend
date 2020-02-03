const jwt = require('jsonwebtoken')

const { secretOrKey } = require('./keys')

const { authentication } = require('../api/constants/errorCodes')

module.exports = {
  verifyToken: (req, res, next) => {
    jwt.verify(
      req.headers.authorization,
      secretOrKey,
      (err, authorizedData) => {
        if (!err) {
          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        }
        return res.json({ code: authentication, error: 'breach' })
      }
    )
  }
}
