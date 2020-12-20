var mongoose = require('mongoose')
//const accountsModel = require('./account.model')

//Define a schema
var Schema = mongoose.Schema

const Counters = new Schema({
  name: {
    type: String,
  },
  value: {
    type: Number,
    default: 1,
  },
})
var countersModel = mongoose.model('Counters', Counters)

module.exports = countersModel
