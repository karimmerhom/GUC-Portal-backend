const success = 0

const validation = 101

const emailExists = 102

const unknown = 103

const invalidCredentials = 104

const unVerified = 105

const wrongVerificationCode = 106

const alreadyVerified = 107
//Old password like new password
const SamePassword = 108

const authentication = 109
//User forgot password and didn't reset it
const forgotPassword = 110

const notAccessibleNow = 111

const verificationCodeExpired = 112

const dateInThePast = 113

const entityNotFound = 114

const bookingCanceled = 115

const slotNotFree = 116

const packageAlreadyExists = 117

const invalidDateInput = 118

const peopleOverload = 119

const invalidPackage = 120

const packageUsed = 121

const packageCanceled = 122

const unauthorized = 123
//Cannot expire a confirmed booking
const bookingConfirmed = 124

const alreadySuspended = 125

const contactsError = 126

const underAge = 127

const invitationAlreadyExists = 128

const EventNotActive = 129

const reachedMaximumAmountOfPeopleEvent = 130

const collaboratorExists = 131

const eventFullyBooked = 132

const eventNotOpenForRegisteration = 133

const cannotEditRegisteration = 134
const formExists = 135
const formNotFound = 136
const cousrseDoesntExist = 137

const invalidOtp = 138
const insufficientPoints = 139
const nameExists = 138
const invalidId = 139

const pendingLimitExceeded = 140

module.exports = {
  insufficientPoints,
  invalidOtp,
  success,
  validation,
  emailExists,
  unknown,
  invalidCredentials,
  unVerified,
  wrongVerificationCode,
  alreadyVerified,
  SamePassword,
  authentication,
  forgotPassword,
  notAccessibleNow,
  verificationCodeExpired,
  dateInThePast,
  entityNotFound,
  bookingCanceled,
  slotNotFree,
  packageAlreadyExists,
  invalidDateInput,
  peopleOverload,
  invalidPackage,
  packageUsed,
  packageCanceled,
  unauthorized,
  bookingConfirmed,
  alreadySuspended,
  contactsError,
  underAge,
  invitationAlreadyExists,
  EventNotActive,
  reachedMaximumAmountOfPeopleEvent,
  collaboratorExists,
  eventNotOpenForRegisteration,
  eventFullyBooked,
  cannotEditRegisteration,
  formExists,
  formNotFound,
  cousrseDoesntExist,
  nameExists,
  invalidId,
  pendingLimitExceeded
}
