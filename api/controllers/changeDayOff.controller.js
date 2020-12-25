const changeDayOffModel = require('../../models/changeDayOff.model')
const slotsModel = require('../../models/slots.modal')
const accountsModel = require('../../models/account.model')
const leaveStatus = require('../../api/constants/GUC.enum')


const requestChangeDayOff = async (req, res) => {
    try {

      const request = req.body
      const requestFound = await changeDayOffModel.findOne({
       academicId: request.academicId,
       newDayOff: request.newDayOff
      })
      const slots=req.body
      const slotsOnDay = await slotsModel.findOne({
        assignedAcademicId: slots.academicId,
        day: slots.newDayOff
      })
      const account = req.body
      const accountFound = await accountsModel.findOne({
          academicId: account.academicId,
          dayOff: account.newDayOff
      }) 
      if (accountFound){
        return res.json({
          statusCode: 101,
          error: 'This is already your day off',
        })
      }
  
      if (slotsOnDay){
        return res.json({
          statusCode: 101,
          error: 'You have slots on this day',
        })
      }
  
      if (requestFound) {
        return res.json({
          statusCode: 101,
          error: 'request already submitted',
        })}

        
      
      
     await changeDayOffModel.create(request, function (err, result) {
        console.log(err)
        console.log(result)
      })
  
      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
  const updateRequest = async (req, res) => {//check and check its validation
    try {

      const body = req.body
      const requestFound = await changeDayOffModel.findById(body.reqId)
      const accountFound = await accountsModel.findOne({academicId: requestFound.academicId})
      //const accountFoundUser = await accountsModel.findOne({academicId: body.Account.academicId})
    /* if (!(accountFound.department===accountFoundUser.department)){
      return res.json({
        statusCode: 101,
        error: 'You are not the head of this member request department',
      })
     }*/
     
     
      if(!requestFound){
        return res.json({
          statusCode: 101,
          error: 'request does not exist',
        })
       }
      if(requestFound.status === leaveStatus.ACCEPTED)
      {
        return res.json({
          statusCode: 101,
          error: 'this request is already accepted',
        })
      }
      await changeDayOffModel.findByIdAndUpdate(body.reqId, {status: body.status})
      await accountsModel.findByIdAndUpdate(accountFound.id, {dayOff: requestFound.newDayOff})
      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }


  } 



 

  module.exports = {
    requestChangeDayOff,
    updateRequest
    
   

}