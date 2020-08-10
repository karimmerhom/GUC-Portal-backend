const extremePackage = require('../../models/extremePackage.model')
const regularPackage = require('../../models/regularPackage.model')
const errorCodes = require('../constants/errorCodes')

const createPackage = async (req, res) => {
  try {
    const body = req.body
    const Type = req.body.packageType
    if (Type === "regular")
    {
      delete body.packageType
      await regularPackage.create(body)
      return res.json({
        code: success
    })
  }
  if (Type === "extreme")
  {
    delete body.packageType
    await extremePackage.create(body)
    return res.json({
      code: success
  })
}
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}


module.exports = {
  createPackage
}
