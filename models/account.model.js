var mongoose = require('mongoose')
//const accountsModel = require('./account.model')
const { userTypes, memberType, days } = require('../api/constants/GUC.enum')

//Define a schema
var Schema = mongoose.Schema

const Accounts = new Schema({
  academicId: {
    type: String,
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    enum: [userTypes.HR, userTypes.ACADEMICMEMBER],
  },
  memberType: {
    type: String,
    enum: [
      memberType.MEMBER,
      memberType.HOD,
      memberType.INSTRUCTOR,
      memberType.COORDINATOR,
    ],
    default: memberType.MEMBER,
  },
  gender: {
    type: String,
  },
  dayOff: {
    type: String,
    enum: [
      days.SATURDAY,
      days.SUNDAY,
      days.MONDAY,
      days.TUESDAY,
      days.WEDNESDAY,
      days.THURSDAY,
    ],
    default: days.SATURDAY,
  },
})
var accoundtsModal = mongoose.model('Accounts', Accounts)

module.exports = accoundtsModal