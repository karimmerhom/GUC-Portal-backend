var mongoose = require('mongoose')
const departmentModel = require('./department.model')
//const accountsModel = require('./account.model')

//Define a schema
var Schema = mongoose.Schema

const faculty = new Schema({
  name : {type: String},
})
var facultysModel = mongoose.model('faculty', faculty)

module.exports = facultysModel
