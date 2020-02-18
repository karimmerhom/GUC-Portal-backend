const VerificationCode = require('../../models/verificationCodes')
const errorCodes = require('../constants/errorCodes')
const CalendarModel = require('../../models/calendar.model')
const PackageModel = require('../../models/package.model')
const BookingModel = require('../../models/booking.model')
const { accountStatus, slotStatus } = require('../constants/TBH.enum')
const axios = require('axios')
const { contactAccessKey } = require('../../config/keys')
const pricingModel = require('../../models/pricing.model')
const accountModel = require('../../models/account.model')

const generateOTP = async () => {
  let text = ''
  const possible = 'abcdefghijkmnopqrstuvwxyz0123456789'
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
  if (packageCode === '' || packageCode === null) {
    let packageFound
    if (amountOfPeople <= 5 && roomType === 'meeting room') {
      packageFound = await pricingModel.findOne({ where: { code: 'MRFRSG' } })
    }
    if (
      amountOfPeople > 5 &&
      amountOfPeople <= 10 &&
      roomType === 'meeting room'
    ) {
      packageFound = await pricingModel.findOne({ where: { code: 'MRFRLG' } })
    }
    if (amountOfPeople <= 7 && roomType === 'training room') {
      packageFound = await pricingModel.findOne({ where: { code: 'TRFRSG' } })
    }
    if (
      amountOfPeople >= 8 &&
      amountOfPeople <= 16 &&
      roomType === 'training room'
    ) {
      packageFound = await pricingModel.findOne({ where: { code: 'TRFRSG' } })
    }
    price = hours * packageFound.price
  }
  let newHours
  if (packageCode !== '' && packageCode !== null) {
    const package = await PackageModel.findOne({
      where: { code: packageCode }
    })
    if (!package) {
      return {
        code: errorCodes.entityNotFound,
        error: 'Package not found'
      }
    }
    if (package.status !== accountStatus.ACTIVE) {
      return {
        code: errorCodes.packageCanceled,
        error: 'Package is not active'
      }
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

const expireBooking = async (id, status = accountStatus.EXPIRED) => {
  const booking = await BookingModel.findOne({ where: { id } })
  if (booking.status === accountStatus.CONFIRMED) {
    return {
      code: errorCodes.bookingConfirmed,
      error: 'Cannot expire a confirmed booking'
    }
  }
  let slots = []
  slots = booking.slot
  // if (booking.packageCode !== '' && booking.packageCode !== null) {
  //   const package = await PackageModel.findOne({
  //     where: { code: booking.packageCode }
  //   })
  //   await PackageModel.update(
  //     { remaining: package.remaining + slots.length },
  //     {
  //       where: {
  //         code: booking.packageCode
  //       }
  //     }
  //   )
  //   if (package.status === accountStatus.USED) {
  //     await PackageModel.update(
  //       { status: accountStatus.ACTIVE },
  //       {
  //         where: {
  //           code: booking.packageCode
  //         }
  //       }
  //     )
  //   }
  // }
  for (i = 0; i < slots.length; i++) {
    await CalendarModel.destroy({
      where: {
        slot: slots[i],
        date: new Date(booking.date),
        roomNumber: booking.roomNumber
      }
    })
  }
  await BookingModel.update({ status }, { where: { id } })
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

const gift_package = async (numberOfHours, roomType, accountId) => {
  try {
    const account = await accountModel.findOne({
      where: { id: parseInt(accountId) }
    })
    if (!account) {
      return res.json({
        code: errorCodes.entityNotFound,
        error: 'User not found'
      })
    }
    const code = await generateOTP()
    await VerificationCode.create({
      code,
      date: new Date()
    })
    const packageCreated = await PackageModel.create({
      code,
      remaining: numberOfHours,
      status: accountStatus.ACTIVE,
      package: 'custom',
      price: 0,
      roomType: roomType,
      accountId: parseInt(accountId)
    })
    return { code: errorCodes.success, packageCode: code }
  } catch (exception) {
    return res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}

module.exports = {
  generateOTP,
  checkFreeSlot,
  checkPrice,
  expireBooking,
  eraseDatabaseOnSyncContacts,
  gift_package
}
