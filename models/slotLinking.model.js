var mongoose = require('mongoose')
//const accountsModel = require('./account.model')
const { userTypes, memberType, days } = require('../api/constants/GUC.enum')

//Define a schema
var Schema = mongoose.Schema

const slotLinking = new Schema({
  slotId: {
    type: String,
  },
  academicId: {
    type: String,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
})

var slotLinkingModel = mongoose.model('slotLinking', slotLinking)

module.exports = slotLinkingModel
