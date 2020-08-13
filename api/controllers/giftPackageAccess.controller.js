const giftPackageAccess = require('../../models/giftPackageAccess.model')
const { packageStatus } = require('../constants/TBH.enum')
const errorCodes = require('../constants/errorCodes')

const createGiftPackageAccess = async (req, res) => {
  try {
<<<<<<< HEAD
    await giftPackageAccess.create(req.body)
    return res.json({
      code: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception + 'sssssssss')
=======
     await giftPackageAccess.create(req.body)
      return res.json({
        code: errorCodes.success,
      })
  } catch (exception) {
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
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
<<<<<<< HEAD
    return res.json({ code: 7006, error: 'id not found' })
  } catch (exception) {
    console.log(exception + 'sssssssss')
=======
  return res.json({ code: errorCodes.invalidId , error: "id not found" })
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
  return res.json({ code: errorCodes.invalidId , error: "id not found" })
  } catch (exception) {
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  createGiftPackageAccess,
  editGiftPackageAccess,
<<<<<<< HEAD
=======
  deleteGiftPackageAccess
>>>>>>> aa34caa8ea11e267fca85cfd19c35b0bc3b7d2b0
}
