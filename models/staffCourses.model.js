var mongoose = require('mongoose')
const {
  userTypes,
  memberType,
  days,
  slotNames,
  position,
} = require('../api/constants/GUC.enum')
//Define a schema
var Schema = mongoose.Schema

const staffCourses = new Schema({
  academicId: { type: String },
  courseId: { type: String }, // change to course name ask karim
  position: {
    type: String,
    enum: [position.COORDINATOR, position.INSTRUCTOR, position.MEMBER],
  },
})
var staffCoursesModel = mongoose.model('staffCourses', staffCourses)

module.exports = staffCoursesModel
