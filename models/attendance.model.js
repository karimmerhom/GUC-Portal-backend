var mongoose = require('mongoose')
const coursesModel = require('./courses.model')
//const accountsModel = require('./account.model')

//Define a schema
var Schema = mongoose.Schema

const attendance = new Schema({
  accountId: { type: String },
  academicId: { type: String },
  signInTime: { type: String },
  signOutTime: { type: String },
  totalTime: { type: Number },
  //  head : [accountsModel.schema],
})
var attendanceModel = mongoose.model('attendance', attendance)

module.exports = attendanceModel
