var mongoose = require('mongoose')
const { leaveStatus, leaveTypes } = require('../api/constants/GUC.enum')

//Define a schema
var Schema = mongoose.Schema

const replacementsRequests = new Schema({
  academicId: { type: String },
  academicIdReciever: { type: String },
  date: { type: String },
  status: {
    type: String,
    enum: [leaveStatus.ACCEPTED, leaveStatus.PENDING, leaveStatus.REJECTED],
  },
  slotId: { type: String },

  hodStatus: {
    type: String,
    enum: [leaveStatus.ACCEPTED, leaveStatus.PENDING, leaveStatus.REJECTED],
  },
})
var replacementsRequestsModel = mongoose.model(
  'replacementsRequests',
  replacementsRequests
)

module.exports = replacementsRequestsModel
