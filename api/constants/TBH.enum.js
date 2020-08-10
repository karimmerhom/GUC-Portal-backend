const accountStatus = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  ACTIVE: 'active',
  USED: 'used',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
}

const userTypes = {
  ADMIN: 'admin',
  USER: 'user',
}

const paymentMethods = {
  CASH: 'cash',
  VODAFONECASH: 'vodafone cash',
}

const gender = {
  MALE: 'male',
  FEMALE: 'female',
}

const verificationMethods = {
  SMS: 'sms',
  EMAIL: 'email',
}

const slotStatus = {
  BUSY: 'Busy',
  FREE: 'Free',
  PENDING: 'Pending',
}

const roomPricing = {
  meetingRoomF0T5Users: {
    F10T20: '100',
    F21T50: '90',
    F50: '80',
  },
  meetingRoomF6T10Users: {
    F10T20: '170',
    F21T50: '160',
    F50: '150',
  },
  trainingRoomF0T7Users: {
    F10T20: '180',
    F21T50: '170',
    F50: '150',
  },
  trainingRoomF8T16Users: {
    F10T20: '280',
    F21T50: '270',
    F50: '250',
  },
}

const invitationStatus = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PENDING: 'pending',
  REGISTERED: 'registered',
  INQUEUE: 'Inqueue',
}

const eventStatus = {
  POSTED: 'posted',
  OPENFORREGISTERATION: 'open for registeration',
  FULLYBOOKED: 'fully booked',
  STARTED: 'started',
  ENDED: 'ended',
  CANCELED: 'canceled',
  CONFIRMED: 'confirmed',
}
const roomSize = {
  LARGE: 'large group',
  SMALL: 'small group',
}
const roomType = {
  MEETING: 'meeting room',
  TRAINING: 'training room',
}

const slots = {
  NINE_TEN: 'NINE_TEN',
  TEN_ELEVEN: 'TEN_ELEVEN',
  ELEVEN_TWELVE: 'ELEVEN_TWELVE',
  TWELVE_THIRTEEN: 'TWELVE_THIRTEEN',
  THIRTEEN_FOURTEEN: 'THIRTEEN_FOURTEEN',
  FOURTEEN_FIFTEEN: 'FOURTEEN_FIFTEEN',
  FIFTEEN_SIXTEEN: 'FIFTEEN_SIXTEEN',
  SIXTEEN_SEVENTEEN: 'SIXTEEN_SEVENTEEN',
  SEVENTEEN_EIGHTEEN: 'SEVENTEEN_EIGHTEEN',
  EIGHTEEN_NINETEEN: 'EIGHTEEN_NINETEEN',
  NINETEEN_TWENTY: 'NINETEEN_TWENTY',
  TWENTY_TWENTYONE: 'TWENTY_TWENTYONE',
  TWENTYONE_TWENTYTWO: 'TWENTYONE_TWENTYTWO',
}

module.exports = {
  accountStatus,
  paymentMethods,
  gender,
  verificationMethods,
  slotStatus,
  roomPricing,
  userTypes,
  invitationStatus,
  eventStatus,
  roomSize,
  roomType,
}
