var mongoose = require('mongoose')

//Define a schema
var Schema = mongoose.Schema

const leaves = new Schema({
  academicId : {type: String},
  date: {type: String},
  type: {type: String},
  reasonForCompensation: {type: String},
  status: {
    type: String, 
    default: ("rejected")},
  comments: {type: String}
})
var leavesModel = mongoose.model('leaves', leaves)

module.exports = leavesModel
