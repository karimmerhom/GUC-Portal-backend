const giftPackageAccess = require('../../models/giftPackageAccess.model')
const { packageStatus } = require('../constants/TBH.enum')
const errorCodes = require('../constants/errorCodes')


const createGiftPackageAccess = async (req, res) => {
  try {
    const accId = req.body.accountId

    const found = giftPackageAccess.findOne({where: {
      accountId: accId,
    }},)

    if (! found) {
     await giftPackageAccess.create(body)
      return res.json({
        code: errorCodes.success,
      })
    }
  return res.json({ code: 7006, error: "account already given access" })
  } catch (exception) {
    console.log(exception + '  jjjjjjjjj')
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const editGiftPackageAccess = async (req, res) => {
  try {
    const id = req.body.id

    const found = giftPackageAccess.findOne({where: {
      id: id,
    }},)

    if (! found) {
     await giftPackageAccess.update(body)
      return res.json({
        code: errorCodes.success,
      })
    }
  return res.json({ code: 7006, error: "account already given access" })
  } catch (exception) {
    console.log(exception + '  jjjjjjjjj')
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}


