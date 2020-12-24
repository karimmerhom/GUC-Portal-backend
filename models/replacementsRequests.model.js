var mongoose = require('mongoose')
const { leaveStatus, leaveTypes } = require('../api/constants/GUC.enum')

//Define a schema
var Schema = mongoose.Schema

const compensationRequests = new Schema({
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
var compensationRequestsModel = mongoose.model(
  'compensationRequests',
  compensationRequests
)

module.exports = compensationRequestsModel
