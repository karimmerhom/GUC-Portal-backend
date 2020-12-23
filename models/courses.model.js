var mongoose = require('mongoose')
//const accountsModel = require('./account.model')

//Define a schema
var Schema = mongoose.Schema

const courses = new Schema({
  courseId: { type: String },
  courseName: { type: String },
  creditHours: { type: Number },
  //staff: [accountsModel.schema],
  department: { type: String },
})
var coursesModel = mongoose.model('courses', courses)

module.exports = coursesModel
