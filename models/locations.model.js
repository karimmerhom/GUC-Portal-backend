var mongoose = require('mongoose')
const { locationNames } = require('../api/constants/GUC.enum')

//Define a schema
var Schema = mongoose.Schema

const locations = new Schema({
  name: { type: String },
  MaxCapacity: { type: Number },
  capacity: { type: Number },
  type: { type: String ,
    enum: [
      locationNames.LECTUREHALL,
      locationNames.OFFICE,
      locationNames.ROOM,
    ]},
  list: [{ type: String }],
})
var locationsModel = mongoose.model('locations', locations)

module.exports = locationsModel
