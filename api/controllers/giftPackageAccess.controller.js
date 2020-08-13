const giftPackageAccess = require('../../models/giftPackageAccess.model')
const { packageStatus } = require('../constants/TBH.enum')
const errorCodes = require('../constants/errorCodes')

const createGiftPackageAccess = async (req, res) => {
  try {
    await giftPackageAccess.create(req.body)
    return res.json({
      code: errorCodes.success,
    })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const editGiftPackageAccess = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    const found = await giftPackageAccess.findOne({
      where: {
        id: parseInt(id),
      },
    })
    if (found) {
      delete body.id
      await giftPackageAccess.update(req.body, {
        where: {
          id: parseInt(id),
        },
      })
      return res.json({
        code: errorCodes.success,
      })
    }
    return res.json({ code: errorCodes.invalidId, error: 'id not found' })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const deleteGiftPackageAccess = async (req, res) => {
  try {
    const id = req.body.id
    const found = await giftPackageAccess.findOne({
      where: {
        id: parseInt(id),
      },
    })
    if (found) {
      found.destroy()
      return res.json({
        code: errorCodes.success,
      })
    }
    return res.json({ code: errorCodes.invalidId, error: 'id not found' })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  createGiftPackageAccess,
  editGiftPackageAccess,
  deleteGiftPackageAccess,
}
