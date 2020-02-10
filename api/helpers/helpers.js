const VerificationCode = require('../../models/verificationCodes')
const errorCodes = require('../constants/errorCodes')
const CalendarModel = require('../../models/calendar.model')

const generateOTP = async () => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  const duplicate = await VerificationCode.findOne({ where: { code: text } })
  if (duplicate) {
    return generateOTP()
  }
  return text
}

const checkFreeSlot = async (slot, date, roomNumber) => {
  const bookingDate = new Date(date)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const month = months[bookingDate.getMonth()]

  const checkSlot = await CalendarModel.findOne({
    where: {
      slot: slot,
      dayNumber: bookingDate.getDate(),
      month,
      monthNumber: bookingDate.getMonth(),
      year: bookingDate.getFullYear(),
      roomNumber
    }
  })
  if (checkSlot) {
    return {
      code: errorCodes.slotNotFree,
      error: 'Slot is not free'
    }
  }
  return { code: errorCodes.success }
}

const checkPrice = async (amountOfPeople, roomType) => {}

module.exports = {
  generateOTP,
  checkFreeSlot
}
