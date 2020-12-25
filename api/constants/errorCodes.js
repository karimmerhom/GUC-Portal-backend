const success = 0

const validation = 101

const emailExists = 102

const unknown = 103

const invalidCredentials = 104

const firstLogin = 105

const wrongVerificationCode = 106

const alreadyVerified = 107
//Old password like new password
const SamePassword = 108

const authentication = 109
//User forgot password and didn't reset it
const forgotPassword = 110

const notAccessibleNow = 111

const departmentDoesnotExist = 112

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
const nameExists = 140
const invalidId = 141
const approvedCourse = 142

const pendingLimitExceeded = 143

const phoneExists = 144

const usernameExists = 145

const roomAlreadyExists = 146
const roomNotFound = 147

const pastDateBooking = 148
const notUserBooking = 149
const bookingExpired = 150
const bookingNotFound = 151
const roomBusy = 152
const bookingAlreadyCanceled = 153
const bookingAlreadyConfirmed = 154
const roomNotAvailable = 155
const packageCannotBePurchased = 156

const setExpiryDurationOff = 157

const pricingAlreadyExists = 158
const accountDoesNotExist = 159
const linkedSuccessfully = 160
const accountAlreadyLinkedSuccessfully = 161
const couldntCreateAccount = 162
const lirtenHubLinkedToAnotherAcount = 163
const tbhLinkedToAnotherAccount = 164
const linkedGoogleFacebook = 165
const linkedWithAnotherAccount = 166
const noAvailableRoomSlots = 167
const hasNoPassword = 168
const adminOnlyAccess = 169

const courseNotFound = 200
const notYourCourse = 201
const LocationNotFound = 202
const slotTaken = 203
const slotNotFound = 204
const slotAssigned = 205
const wrongUserType = 206
const notYourDepartment = 207
const coordinatorAlreadyExists = 208
const instructorAlreadyExists = 209
const memberAlreadyAssigned = 210
const assignmentDoesNotExist = 211
const linkAccepted = 212
//attendance module

const accountNotFound = 213
const alreadySignedIn = 214
const haventSignedIn = 215
const alreadySignedOut = 216
const cantSignInAfter19 = 217
const cantManualSignIn = 218

module.exports = {
  cantSignInAfter19,
  cantManualSignIn,
  linkAccepted,
  memberAlreadyAssigned,
  assignmentDoesNotExist,
  coordinatorAlreadyExists,
  instructorAlreadyExists,
  notYourDepartment,
  wrongUserType,
  slotAssigned,
  slotNotFound,
  slotTaken,
  LocationNotFound,
  notYourCourse,
  courseNotFound,
  firstLogin,
  noAvailableRoomSlots,
  alreadySignedIn,
  accountNotFound,
  accountAlreadyLinkedSuccessfully,
  couldntCreateAccount,
  lirtenHubLinkedToAnotherAcount,
  tbhLinkedToAnotherAccount,
  linkedSuccessfully,
  accountDoesNotExist,
  setExpiryDurationOff,
  pricingAlreadyExists,
  roomNotAvailable,
  packageCannotBePurchased,
  pastDateBooking,
  notUserBooking,
  bookingExpired,
  bookingNotFound,
  roomBusy,
  bookingAlreadyCanceled,
  bookingAlreadyConfirmed,
  roomAlreadyExists,
  roomNotFound,
  insufficientPoints,
  invalidOtp,
  success,
  validation,
  emailExists,
  unknown,
  invalidCredentials,
  wrongVerificationCode,
  alreadyVerified,
  SamePassword,
  authentication,
  forgotPassword,
  notAccessibleNow,
  departmentDoesnotExist,
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
  approvedCourse,
  pendingLimitExceeded,
  phoneExists,
  usernameExists,
  linkedGoogleFacebook,
  linkedWithAnotherAccount,
  hasNoPassword,
  adminOnlyAccess,
  haventSignedIn,
  alreadySignedOut,
}
