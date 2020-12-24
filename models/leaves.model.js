const { boolean } = require('joi')
var mongoose = require('mongoose')
const { leaveStatus, leaveTypes } = require('../api/constants/GUC.enum')

//Define a schema
var Schema = mongoose.Schema

const leaves = new Schema({
  academicId: { type: String },
  date: { type: String },
  type: {
    type: String,
    enum: [
      leaveTypes.MATERNITY,
      leaveTypes.ACCIDENTAL,
      leaveTypes.ANNUAL,
      leaveTypes.SICK,
    ],
  },
  reasonForCompensation: { type: String },
  status: {
    type: String,
    enum: [leaveStatus.ACCEPTED, leaveStatus.PENDING, leaveStatus.REJECTED],
  },
  repReqId: [{ type: String }],
  allRepReq: { type: Boolean },
  comments: { type: String },
})
var leavesModel = mongoose.model('leaves', leaves)

module.exports = leavesModel
