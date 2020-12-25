const locationsModel = require('../../models/locations.model')
const AccountModel = require('../../models/account.model')
const { locationNames } = require('../constants/GUC.enum')
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
       type: locationNames.OFFICE
      })
      console.log(location.office)
      console.log(locationNames.office)
      const academicFound = await AccountModel.findOne({
        academicId : location.academicId,
       })
      if(location.office === academicFound.office)
      {
        return res.json({
          statusCode: 101,
          error: 'already assigned',
        })
      }
     
      if (!locationFound) {
        return res.json({
          statusCode: 101,
          error: 'this office does not  exist',
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
      console.log(academicFound)

      console.log(academicFound.office)

      const oldLocation = await locationsModel.findOne({
        name: academicFound.office,
       })
       console.log(academicFound.office)
      oldLocation.capacity = oldLocation.capacity - 1 ;
      const oldLocationList = oldLocation.list 
      var index = oldLocationList.indexOf(academicFound.academicId);
      if (index !== -1) {
        oldLocationList.splice(index, 1);
      }
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

  const deleteLocation = async (req, res) => {
    try {
      const location = req.body
      location.capacity = 0 
      const locationFound = await locationsModel.findOne({
       name: location.name,
      })
  
      if (!locationFound) {
        return res.json({
          statusCode: 101,
          error: 'location does not exists',
        })
      }
      
      if(locationFound.type !== "office")
      {
        locationsModel.findByIdAndDelete(locationFound.id, function (err, result) {
          console.log(err)
          console.log(result)
        })
      return res.json({ statusCode: 0000 })
      }
      else
      {
        if(locationFound.capacity === 0 )
        {
          locationsModel.findByIdAndDelete(locationFound.id, function (err, result) {
            console.log(err)
            console.log(result)
          })
        return res.json({ statusCode: 0000 })
        }
        else
        {
          return res.json({
            statusCode: 101,
            error: 'location is not empty',
          })
        }
      }
     

    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
  const updateLocation = async (req, res) => {
    try {
      const location = req.body
      location.capacity = 0 
      const locationFound = await locationsModel.findOne({
       name: location.name,
      })
  
      if (!locationFound) {
        return res.json({
          statusCode: 101,
          error: 'location is not found',
        })
      }
      if(location.MaxCapacity !== null)
      {
      if( location.MaxCapacity < locationFound.capacity)
      {
        return res.json({
          statusCode: 101,
          error: 'office capacity is greater than the new set capacity',
        })
      }
      locationFound.MaxCapacity = location.MaxCapacity
    }
    if(location.newName !== null)
      {
        const newLocationFound = await locationsModel.findOne({
          name: location.newName,
         })
      if(newLocationFound)
      {
        return res.json({
          statusCode: 101,
          error: 'there is an existing office with the new name',
        })
      }
      else
      {
         await AccountModel.update(
       {  office: location.name }, {office: location.newName}
         )
         locationFound.name = location.newName
      }
    }
   
      locationsModel.findByIdAndUpdate(locationFound.id,locationFound, function (err, result) {
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
    assignLocation,
    deleteLocation,
    updateLocation
}