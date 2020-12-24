const replacementsRequestsModel = require('../../../GUC/models/replacementsRequests.model')
const staffCoursesModel = require('../../models/staffCourses.model')
const accountModel = require('../../models/account.model')
const slotsModel = require('../../models/slots.modal')
const moment = require('moment')

const createReplacementRequest = async (req, res) => {
    try {
      const body = req.body
      const senderIdFound = await accountModel.findOne({
       academicId: body.Account.academicId,
      })
      const reciverIdFound = await accountModel.findOne({
        academicId: body.academicIdReciever,
       })
      const slotFound = await slotsModel.findOne({
        _id: body.slotId,
       })
      const canNotComp = await slotsModel.findOne({
        day: slotFound.courseId,
        slot: slotFound.slot,
        assignedAcademicId: body.academicIdReciever
       })
  
      if (!senderIdFound) {
        return res.json({
          statusCode: 101,
          error: 'your id is wrong',
        })
      }
      if (!reciverIdFound) {
        return res.json({
          statusCode: 101,
          error: 'reciver id is wrong',
        })
      }
      if (!slotFound) {
        return res.json({
          statusCode: 101,
          error: 'slot not found',
        })
      }
      if (canNotComp) {
        return res.json({
          statusCode: 101,
          error: 'this accademic member has an assigned slot in the same time',
        })
      }
      const senderCourseFound = await staffCoursesModel.findOne({
        academicId: body.Account.academicId,
        courseId: slotFound.courseId
       })
       const reciverCourseFound = await staffCoursesModel.findOne({
        academicId: body.Account.academicId,
        courseId: slotFound.courseId
       })
       if (!senderCourseFound) {
        return res.json({
          statusCode: 101,
          error: 'you do not teach this course',
        })
      }
      if (!reciverCourseFound) {
        return res.json({
          statusCode: 101,
          error: 'the academic member choosen does not teach this course',
        })
      }
      
      
      const month = body.month
      const day = body.day
      const year = body.year
      const d = moment(`${year}-${month}-${day}T00:00:00.0000`)
      const today = moment()
      
   if(d.isAfter(today)){
    return res.json({
      statusCode: 101,
      error: 'the entered date has already passed',
    })
   }
   const requestFound = await replacementsRequestsModel.findOne({
    academicId: body.Account.academicId,
    academicIdReciever: body.academicIdReciever,
    date: d,
    slotId: body.slotId
   })
   if(requestFound){
    return res.json({
      statusCode: 101,
      error: 'request already sent',
    })
   }
      delete body.Account
      
      replacementsRequestsModel.create(
        {
          academicId:body.Account.academicId,
          academicIdReciever:body.academicIdReciever,
          date:d,
          slotId:body.slotId,
        }
      )
      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
}
const viewRecievedReq = async(req,res)=>{
  try {
    const body = req.body
    const recievedRequests = await replacementsRequestsModel.find({academicIdReciever: body.Account.academicId,})
    if(recievedRequests.length !==0)
    {
    return res.json({ statusCode: 0000 , list: recievedRequests })
    }
    else{
      return res.json({ statusCode: 0000 , error: "no requests found" })
    }
}

catch (exception) {
  console.log(exception)
return res.json({ statusCode: 400, error: 'Something went wrong' })
}
}
const viewSentReq = async(req,res)=>{
  try {
    const body = req.body
    const sentRequests = await replacementsRequestsModel.find({academicId:body.Account.academicId,})
    if(sentRequests.length !== 0)
    {
    return res.json({ statusCode: 0000 , list: sentRequests })
    }
    else{
      return res.json({ statusCode: 0000 , error: "no requests sent" })
    }
}

catch (exception) {
  console.log(exception)
return res.json({ statusCode: 400, error: 'Something went wrong' })
}
}
const updateReplacementRequestStatus = async (req, res) => {
  try {

    const body = req.body
    const requestFound = await replacementsRequestsModel.findByIdAndUpdate({
    })
    if(!requestFound){
      return res.json({
        statusCode: 101,
        error: 'request does not exist',
      })
     }
    replacementsRequestsModel.findByIdAndUpdate(body.reqId, {status: body.status})
    return res.json({ statusCode: 0000 })
  } catch (exception) {
      console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
  module.exports = {
    createReplacementRequest,
    viewRecievedReq,
    viewSentReq,
    updateReplacementRequestStatus
}