var mongoose = require('mongoose')
//const accountsModel = require('./account.model')

//Define a schema
var Schema = mongoose.Schema

const locations = new Schema({
  name: { type: String },
  capacity: {type: Number},
  type: {type: String},
})
var locationsModel = mongoose.model('locations', locations)

module.exports = locationsModel
