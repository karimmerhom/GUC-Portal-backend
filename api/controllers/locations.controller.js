//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty 
//waiting for youssef to finish assign method 

//update and delete wa2feeen 3ala youssef 3shan nt2akd en mafeesh tas fl office 
// assign office wa2fa 3ala youssef
const locationsModel = require('../../models/locations.model')
const AccountModel = require('../../models/account.model')
const createLocation = async (req, res) => {
    try {
      const location = req.body
      location.capacity = 0 
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

  const assignLocation = async (req, res) => {
    try {
      const location = req.body
      const locationFound = await locationsModel.findOne({
       name: location.office,
      })
      const academicFound = await AccountModel.findOne({
        academicId : location.academicId,
       })
      
     
      if (!locationFound) {
        return res.json({
          statusCode: 101,
          error: 'location does not  exist',
        })
      }
      if (!academicFound) {
        return res.json({
          statusCode: 101,
          error: 'academic does not exist',
        })
      }
  
      if(locationFound.MaxCapacity == locationFound.capacity)
      {
        return res.json({
          statusCode: 201,
          error: 'office is full',
        })
      }
      const oldLocation = await locationsModel.findOne({
        name: academicFound.office,
       })
      oldLocation.capacity = oldLocation.capacity - 1 ;
      const oldLocationList = oldLocation.list 
      index = oldLocationList.findIndex(x => x === location.academicId);
      oldLocationList.slice(index,1)
      oldLocation.list = oldLocationList
      await locationsModel.findByIdAndUpdate(
        oldLocation.id , oldLocation
        )
      locationFound.capacity=locationFound.capacity+1
      locationFound.list.push(location.academicId)
      await locationsModel.findByIdAndUpdate(
       locationFound.id , locationFound
       )
       await AccountModel.findByIdAndUpdate(
      academicFound.id , {office: location.office}
       )

      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }

 

  module.exports = {
    createLocation,
    assignLocation

}