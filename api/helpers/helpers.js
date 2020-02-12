const VerificationCode = require('../../models/verificationCodes')
const errorCodes = require('../constants/errorCodes')
const CalendarModel = require('../../models/calendar.model')
const PackageModel = require('../../models/package.model')
const BookingModel = require('../../models/booking.model')
const { accountStatus, slotStatus } = require('../constants/TBH.enum')
const axios = require('axios')
const { contactAccessKey } = require('../../config/keys')

const generateOTP = async () => {
  let text = ''
  const possible =
    'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789'
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

const checkPrice = async (
  amountOfPeople,
  roomType,
  hours,
  packageCode,
  accountId
) => {
  let price
  if (amountOfPeople > 10 && roomType === 'meeting room') {
    return { code: errorCodes.peopleOverload }
  }
  if (amountOfPeople > 16 && roomType === 'training room') {
    return { code: errorCodes.peopleOverload }
  }
  if (packageCode === '') {
    if (amountOfPeople <= 5 && roomType === 'meeting room') {
      price = hours * 100
    }
    if (
      amountOfPeople > 5 &&
      amountOfPeople <= 10 &&
      roomType === 'meeting room'
    ) {
      price = hours * 170
    }
    if (amountOfPeople <= 7 && roomType === 'training room') {
      price = hours * 200
    }
    if (
      amountOfPeople >= 8 &&
      amountOfPeople <= 16 &&
      roomType === 'training room'
    ) {
      price = hours * 300
    }
  }
  let newHours
  if (packageCode !== '') {
    const package = await PackageModel.findOne({
      where: { code: packageCode }
    })
    if (!package) {
      return {
        code: errorCodes.entityNotFound,
        error: 'Package not found'
      }
    }
    if (package.status === accountStatus.CANCELED) {
      return { code: errorCodes.packageCanceled, error: 'Package canceled' }
    }
    if (parseInt(package.accountId) !== parseInt(accountId)) {
      return { code: errorCodes.invalidPackage, error: 'Invalid package' }
    }
    if (package.status === accountStatus.USED || package.remaining === 0) {
      return { code: errorCodes.packageUsed, error: 'Package used' }
    }
    newHours = hours - package.remaining
    if (newHours > 0) {
      price = await checkPrice(amountOfPeople, roomType, newHours, '', '')
      price = price.price
      newHours = 0
    } else {
      newHours = package.remaining - hours
      price = await checkPrice(amountOfPeople, roomType, 0, '', '')
      price = price.price
    }
  }

  return { price, code: errorCodes.success, remainingHours: newHours }
}

const expireBooking = async id => {
  const booking = await BookingModel.findOne({ where: { id } })
  if (booking.status === accountStatus.CONFIRMED) {
    return {
      code: errorCodes.bookingConfirmed,
      error: 'Cannot expire a confirmed booking'
    }
  }
  let slots = []
  slots = booking.slot
  if (booking.packageCode !== '') {
    const package = await PackageModel.findOne({
      where: { code: booking.packageCode }
    })
    await PackageModel.update(
      { remaining: package.remaining + slots.length },
      {
        where: {
          code: booking.packageCode
        }
      }
    )
    if (package.status === accountStatus.USED) {
      await PackageModel.update(
        { status: accountStatus.ACTIVE },
        {
          where: {
            code: booking.packageCode
          }
        }
      )
    }
  }
  for (i = 0; i < slots.length; i++) {
    await CalendarModel.destroy({
      where: {
        slot: slots[i],
        date: new Date(booking.date),
        roomNumber: booking.roomNumber
      }
    })
  }
  await BookingModel.update(
    { status: accountStatus.EXPIRED },
    { where: { id } }
  )
  return { code: errorCodes.success }
}

const eraseDatabaseOnSyncContacts = async () => {
  try {
    await axios({
      method: 'post',
      url: 'http://18.185.138.12:2003/contacts/dropdatabase',
      data: {
        header: {
          accessKey: contactAccessKey
        }
      }
    })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    return { code: errorCodes.success }
  } catch (exception) {
    return { code: errorCodes.unknown, error: 'Something went wrong' }
  }
}

module.exports = {
  generateOTP,
  checkFreeSlot,
  checkPrice,
  expireBooking,
  eraseDatabaseOnSyncContacts
}
