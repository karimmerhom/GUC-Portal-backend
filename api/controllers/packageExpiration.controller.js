const bookingExpiration = require('../../models/packageExpiration.model')
const errorCodes = require('../constants/errorCodes')




const setPackageExpiration = async (req, res) => {
  try {
    const body = req.body
    
    const found = await bookingExpiration.findOne()
    
    if (found) {
      
     await bookingExpiration.update(req.body ,
      {
        where: {
          id: found.id,
        },
      } )
      return res.json({
        statusCode: errorCodes.success,
      })
    }
    if (!found) {
  
    await bookingExpiration.create(req.body)
      return res.json({
        statusCode: errorCodes.success,
      })
    }
   return res.json({ statusCode: errorCodes.invalidId , error: "id not found" })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  setPackageExpiration,
}


