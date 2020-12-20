var mongoose = require('mongoose')
//Define a schema
var Schema = mongoose.Schema

const staffPositions = new Schema({
  academicId: { type: String },
  position: { type: String },
  Department: { type: String },
  faculty: { type: String },
  office: { type: String },
})
var staffPositionsModel = mongoose.model('staffPositions', staffPositions)

module.exports = staffPositionsModel
