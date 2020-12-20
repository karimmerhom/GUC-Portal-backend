var mongoose = require('mongoose')
const coursesModel = require('./courses.model')
//const accountsModel = require('./account.model')

//Define a schema
var Schema = mongoose.Schema

const department = new Schema({
  name : {type: String},
  faculty: {type: String},
  head : {type: String},
})
var departmentsModel = mongoose.model('department', department)

module.exports = departmentsModel
