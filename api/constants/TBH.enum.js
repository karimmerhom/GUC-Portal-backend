const accountStatus = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  ACTIVE: 'active',
  USED: 'used'
}

const paymentMethods = {
  CASH: 'cash',
  FAWRY: 'fawry',
  CC: 'credit card'
}

const gender = {
  MALE: 'male',
  FEMALE: 'female'
}

const verificationMethods = {
  SMS: 'sms',
  EMAIL: 'email'
}

const slotStatus = {
  BUSY: 'Busy',
  FREE: 'Free'
}

module.exports = {
  accountStatus,
  paymentMethods,
  gender,
  verificationMethods,
  slotStatus
}
