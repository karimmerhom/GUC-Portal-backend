const changeDayOffModel = require('../../models/changeDayOff.model')
const slotsModel = require('../../models/slots.modal')
const accountsModel = require('../../models/account.model')
const leaveStatus = require('../../api/constants/GUC.enum')
const { member } = require('../constants/GUC.enum')
const errorCodes = require('../../api/constants/errorCodes')


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
      }) 
      if (accountFound.type==="HR"){
        return res.json({
          statusCode: 101,
          error: 'HR can not change their day off',
        })
      
      }
      if (accountFound.dayOff===account.newDayOff){
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
      const accountUser = req.body.account
      const requestFound = await changeDayOffModel.findById(body.reqId)
      const accountFound = await accountsModel.findOne({academicId: requestFound.academicId})
      const accountFoundUser = await accountsModel.findOne({
        academicId: accountUser.academicId,
      })
      console.log(accountFoundUser.memberType)
     if(!(accountFoundUser.memberType==="head of department")){
      return res.json({
        statusCode: errorCodes.wrongUserType,
        error: 'This is not a head of department',
      })
     }
     if(accountFoundUser.department!=accountFound.department){
        return res.json({
          statusCode: 101,
          error: 'You are not the head of this member request department',
      })}
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
  const viewSentReq = async (req, res) => {
    try {
      const body = req.body
      const sentRequests = await changeDayOffModel.find({
        academicId: body.Account.academicId,
      })
      if (sentRequests.length !== 0) {
        return res.json({ statusCode: 0000, list: sentRequests })
      } else {
        return res.json({ statusCode: 0000, error: 'no requests sent' })
      }
    } catch (exception) {
      console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }



 

  module.exports = {
    requestChangeDayOff,
    updateRequest,
    viewSentReq

}