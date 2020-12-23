var mongoose = require('mongoose')

//Define a schema
var Schema = mongoose.Schema

const compensationRequests = new Schema({
  academicId : {type: String},
  academicIdReciever: {type:String},
  date: {type: String},
  status: {
    type: String, 
    default: ("rejected")},
  
})
var compensationRequestsModel = mongoose.model('compensationRequests', compensationRequests)

module.exports = compensationRequests
