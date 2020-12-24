var mongoose = require('mongoose')
//const accountsModel = require('./account.model')

//Define a schema
var Schema = mongoose.Schema

const workAttendance = new Schema({
  month: { type: String },
  year: { type: String },
  eid: { type: String },
  totalWorkedDays: { type: Number },
  totalWorkedHours: { type: Number },
})
var workAttendanceModel = mongoose.model('workAttendance', workAttendance)

module.exports = workAttendanceModel
