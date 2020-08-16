const bookingExpiration = require('../../models/packageExpiration.model')
const errorCodes = require('../constants/errorCodes')


const createPackageExpiration = async (req, res) => {
  try {
     await bookingExpiration.create(req.body)
      return res.json({
        statusCode: errorCodes.success,
      })
  } catch (exception) {
    return res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const editPackageExpiration = async (req, res) => {
  try {
    const body = req.body
    const id = req.body.id
    const found = await bookingExpiration.findOne({
      where: {
        id: parseInt(id),
      },
    })
    if (found) {
      delete body.id
     await bookingExpiration.update(req.body ,
      {
        where: {
          id: parseInt(id),
        },
      } )
      return res.json({
        statusCode: errorCodes.success,
      })
    }
  return res.json({ statusCode: errorCodes.invalidId , error: "id not found" })
  } catch (exception) {
    return res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const deletePackageExpiration = async (req, res) => {
  try {
    const id = req.body.id
    const found = await bookingExpiration.findOne({
      where: {
        id: parseInt(id),
      },
    })
    if (found) {
      found.destroy()
      return res.json({
        statusCode: errorCodes.success,
      })
    }
  return res.json({ statusCode: errorCodes.invalidId , error: "id not found" })
  } catch (exception) {
    return res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  createPackageExpiration,
  editPackageExpiration,
  deletePackageExpiration
}


