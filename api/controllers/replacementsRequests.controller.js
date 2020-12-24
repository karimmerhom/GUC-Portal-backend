const replacementsRequestsModel = require('../../models/replacementRequests.model')
const staffCoursesModel = require('../../models/staffCourses.model')
const accountModel = require('../../models/account.model')
const moment = require('moment')
const createReplacementRequest = async (req, res) => {
    try {
      const body = req.body
      const senderIdFound = await accountModel.findOne({
       academicId: body.academicId,
      })
      const reciverIdFound = await accountModel.findOne({
        academicId: body.academicIdReciever,
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
      const senderCourseFound = await staffCoursesModel.findOne({
        academicId: body.academicId,
        courseId: body.courseId
       })
       const reciverCourseFound = await staffCoursesModel.findOne({
        academicId: body.academicId,
        courseId: body.courseId
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
      
      
      const month = body.date.substr(5,2)
      const day = body.date.substr(8,2)
      const year = body.date.substr(0,4)
      const d = moment(`${year}-${month}-${day}T00:00:00.0000`)
      const today = moment()
      
   if(d.isAfter(today)){
    return res.json({
      statusCode: 101,
      error: 'the entered date has already passed',
    })
   }
   const requestFound = await replacementsRequestsModel.findOne({
    academicId: body.academicId,
    academicIdReciever: body.academicIdReciever,
    date: d
   })
   if(requestFound){
    return res.json({
      statusCode: 101,
      error: 'request already sent',
    })


   }
      delete body.courseId
      
      replacementsRequestsModel.create(body)
      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
}
const viewRecievedReq = async(req,res)=>{
  try {
    const body = req.body
    const recievedRequests = await replacementsRequestsModel.find({academicId: body.academicId,})
    return res.json({ statusCode: 0000 , list: recievedRequests })
}

catch (exception) {
  console.log(exception)
return res.json({ statusCode: 400, error: 'Something went wrong' })
}
}
const viewSentReq = async(req,res)=>{
  try {
    const body = req.body
    const sentRequests = await replacementsRequestsModel.find({academicId: body.academicIdReciever,})
    return res.json({ statusCode: 0000 , list: sentRequests })
}

catch (exception) {
  console.log(exception)
return res.json({ statusCode: 400, error: 'Something went wrong' })
}
}
const acceptReplacementRequest = async (req, res) => {
  try {

    const body = req.body
    const requestFound = await replacementsRequestsModel.findOne({
     academicId: body.academicId,
     academicIdReciever: body.academicIdReciever,
     date:body.date
    })
    requestFound.status="accepted"
    replacementsRequestsModel.findByIdAndUpdate(requestFound_id, requestFound)
     
    

    return res.json({ statusCode: 0000 })
  } catch (exception) {
      console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
  module.exports = {
  createReplacementRequest,acceptReplacementRequest}