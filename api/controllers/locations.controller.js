//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty 
//waiting for youssef to finish assign method 

//update and delete wa2feeen 3ala youssef 3shan nt2akd en mafeesh tas fl office 
// assign office wa2fa 3ala youssef
const locationsModel = require('../../models/locations.model')

const createLocation = async (req, res) => {
    try {
      const location = req.body
      const locationFound = await locationsModel.findOne({
       name: location.name,
      })
  
      if (locationFound) {
        return res.json({
          statusCode: 101,
          error: 'location already exists',
        })
      }
  
      locationsModel.create(location, function (err, result) {
        console.log(err)
        console.log(result)
      })
  
      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }

 

  module.exports = {
    createLocation,
   

}