const giftPackageAccess = require('../../models/giftPackageAccess.model')
const { packageStatus } = require('../constants/TBH.enum')
const errorCodes = require('../constants/errorCodes')



const setGiftPackageAccess = async (req, res) => {
  try {
 
    const found = await giftPackageAccess.findOne({})
    if (found) {
      
      await giftPackageAccess.update(req.body, {
        where: {
          id: found.id,
        },
      })
      return res.json({
        statusCode: errorCodes.success,
      })
    }
    if(!found)
    {
      await giftPackageAccess.create(req.body)
      return res.json({
        statusCode: errorCodes.success,
      }) 
    }
    return res.json({ statusCode: errorCodes.invalidId, error: 'id not found' })
  } catch (exception) {
    return res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}


module.exports = {
  setGiftPackageAccess,
}
