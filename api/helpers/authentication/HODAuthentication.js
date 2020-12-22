const jwt = require('jsonwebtoken')

const { secretOrKey } = require('../../../config/keys')
const { memberType, userTypes } = require('../../constants/GUC.enum')

const { authentication } = require('../../constants/errorCodes')

module.exports = {
  verifyHOD: (req, res, next) => {
    jwt.verify(
      req.headers.authorization,
      secretOrKey,
      (err, authorizedData) => {
        if (!err) {
          const header = req.headers.authorization
          const token = header
          if (authorizedData.type === userTypes.ACADEMICMEMBER) {
            if (authorizedData.memberType === memberType.HOD) {
              req.data = authorizedData
              req.token = token
              return next()
            }
          }
          return res.json({
            code: authentication,
            error: 'breach Academic member HOD only access',
          })
        }
        return res.json({ code: authentication, error: 'breach' })
      }
    )
  },
}
