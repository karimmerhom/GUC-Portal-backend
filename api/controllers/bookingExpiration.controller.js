const bookingExpiration = require('../../models/bookingExpiration.model')
const errorCodes = require('../constants/errorCodes')


const createBookingExpiration = async (req, res) => {
  try {
     await bookingExpiration.create(req.body)
      return res.json({
        code: errorCodes.success,
      })
  } catch (exception) {
    console.log(exception+"a7aaaaaaaaaaaaaaaaaaaaaaaa")
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const editBookingExpiration = async (req, res) => {
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
        code: errorCodes.success,
      })
    }
  return res.json({ code: errorCodes.invalidId , error: "id not found" })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const deleteBookingExpiration = async (req, res) => {
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
        code: errorCodes.success,
      })
    }
  return res.json({ code: errorCodes.invalidId , error: "id not found" })
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  createBookingExpiration,
  editBookingExpiration,
  deleteBookingExpiration
}


