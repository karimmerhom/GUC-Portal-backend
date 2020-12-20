var mongoose = require('mongoose')
//Define a schema
var Schema = mongoose.Schema

const staffCourses = new Schema({
  academicId: { type: String },
  course: { type: String },
})
var staffCoursesModel = mongoose.model('staffCourses', staffCourses)

module.exports = staffCoursesModel
