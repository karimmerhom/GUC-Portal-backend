var mongoose = require('mongoose')

//Define a schema
var Schema = mongoose.Schema

const sickRequests = new Schema({
  academicId : {type: String},
  date: {type: String},
  status: {
    type: String, 
    default: ("rejected")},
    documents: String,
})
var sickLeavesModel = mongoose.model('sickRequests', sickRequests)

module.exports = sickLeavesModel
