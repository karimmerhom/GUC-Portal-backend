var mongoose = require('mongoose')
const { leaveStatus, leaveTypes, days } = require('../api/constants/GUC.enum')

var Schema = mongoose.Schema

const changeDayOff = new Schema({
  academicId: { type: String },
  status: {
    type: String,
    enum: [leaveStatus.ACCEPTED, leaveStatus.PENDING, leaveStatus.REJECTED],
    default: 'pending'
  },
  newDayOff: {type: String, 
  enum:[ days.SATURDAY, days.SUNDAY,days.MONDAY,days.TUESDAY,days.WEDNESDAY, days.THURSDAY]}
})
var changeDayOffModel = mongoose.model(
  'changeDayOff',changeDayOff)

module.exports = changeDayOffModel
