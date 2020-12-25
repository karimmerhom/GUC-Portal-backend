const replacementsRequestsModel = require('../../models/replacementsRequests.model')
const staffCoursesModel = require('../../models/staffCourses.model')
const accountModel = require('../../models/account.model')
const slotsModel = require('../../models/slots.modal')
const {
  userTypes,
  memberType,
  days,
  leaveStatus,
  leaveTypes,
} = require('../constants/GUC.enum')

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
    let month = body.month
    let day = body.day
    const year = body.year
    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`

    const d = moment(`${year}-${month}-${day}T00:00:00.0000`)
    const dM = `${year}-${month}-${day}T00:00:00.0000`

    const today = moment()
    console.log(dM)

    const canNotComp = await slotsModel.findOne({
      day: d.format('dddd').toLowerCase(),
      slot: slotFound.slot,
      assignedAcademicId: body.academicIdReciever,
    })
    console.log(d.format('dddd'))
    console.log(canNotComp)
    console.log(slotFound.slot)
    console.log(body.academicIdReciever)

    if (d.format('dddd').toLowerCase() !== slotFound.day) {
      return res.json({
        statusCode: 101,
        error: 'this slot is not on this date',
      })
    }

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
    if (reciverIdFound.type !== userTypes.ACADEMICMEMBER) {
      return res.json({
        statusCode: 101,
        error: 'reciver is not an academic memeber',
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
      courseId: slotFound.courseId,
    })
    const reciverCourseFound = await staffCoursesModel.findOne({
      academicId: body.Account.academicId,
      courseId: slotFound.courseId,
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

    if (today.isAfter(d)) {
      return res.json({
        statusCode: 101,
        error: 'the entered date has already passed',
      })
    }
    const requestFound = await replacementsRequestsModel.findOne({
      academicId: body.Account.academicId,
      academicIdReciever: body.academicIdReciever,
      date: dM,
      slotId: body.slotId,
    })
    if (requestFound) {
      return res.json({
        statusCode: 101,
        error: 'request already sent',
      })
    }

    replacementsRequestsModel.create({
      academicId: body.Account.academicId,
      academicIdReciever: body.academicIdReciever,
      date: dM,
      slotId: body.slotId,
      status: leaveStatus.PENDING,
    })
    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
const viewRecievedReq = async (req, res) => {
  try {
    const body = req.body
    const recievedRequests = await replacementsRequestsModel.find({
      academicIdReciever: body.Account.academicId,
    })
    if (recievedRequests.length !== 0) {
      return res.json({ statusCode: 0000, list: recievedRequests })
    } else {
      return res.json({ statusCode: 0000, error: 'no requests found' })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
const viewSentReq = async (req, res) => {
  try {
    const body = req.body
    const sentRequests = await replacementsRequestsModel.find({
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
const updateReplacementRequestStatus = async (req, res) => {
  try {
    const body = req.body
    const requestFound = await replacementsRequestsModel.findById(body.reqId)
    if (!requestFound) {
      return res.json({
        statusCode: 101,
        error: 'request does not exist',
      })
    }
    if (requestFound.status === leaveStatus.ACCEPTED) {
      return res.json({
        statusCode: 101,
        error: 'this request is already accepted',
      })
    }
    await replacementsRequestsModel.findByIdAndUpdate(body.reqId, {
      status: body.status,
    })
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
  updateReplacementRequestStatus,
}
