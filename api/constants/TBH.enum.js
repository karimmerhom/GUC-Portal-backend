const accountStatus = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  ACTIVE: 'active',
  USED: 'used',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended'
}

const userTypes = {
  ADMIN: 'admin',
  USER: 'user'
}

const paymentMethods = {
  CASH: 'cash',
  FAWRY: 'fawry',
  CC: 'credit card',
  VODAFONECASH: 'vodafone cash'
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
  FREE: 'Free',
  PENDING: 'Pending'
}

const roomPricing = {
  meetingRoomF0T5Users: {
    F10T20: '100',
    F21T50: '90',
    F50: '80'
  },
  meetingRoomF6T10Users: {
    F10T20: '170',
    F21T50: '160',
    F50: '150'
  },
  trainingRoomF0T7Users: {
    F10T20: '180',
    F21T50: '170',
    F50: '150'
  },
  trainingRoomF8T16Users: {
    F10T20: '280',
    F21T50: '270',
    F50: '250'
  }
}

module.exports = {
  accountStatus,
  paymentMethods,
  gender,
  verificationMethods,
  slotStatus,
  roomPricing,
  userTypes
}
