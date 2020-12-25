var mongoose = require('mongoose')
//const accountsModel = require('./account.model')
const {
  userTypes,
  memberType,
  days,
  slotNames,
slotTypes
} = require('../api/constants/GUC.enum')

//Define a schema
var Schema = mongoose.Schema

const slots = new Schema({
  day: {
    type: String,
    enum: [
      days.SATURDAY,
      days.SUNDAY,
      days.MONDAY,
      days.TUESDAY,
      days.WEDNESDAY,
      days.THURSDAY,
    ],
  },
  slot: {
    type: String,
    enum: [
      slotNames.FIRST,
      slotNames.SECOND,
      slotNames.THIRD,
      slotNames.FOURTH,
      slotNames.FIFTH,
    ],
  },
  courseId: {
    type: String,
  },
  locationName: { type: String },
  assignedAcademicId: {
    type: String,
  },
  slotType:{
    type: String,
    enum: [
      slotTypes.LAB,
      slotTypes.LECTURE,
      slotTypes.TUTORIAL
    ],
  },
})

var slotsModel = mongoose.model('slots', slots)

module.exports = slotsModel
