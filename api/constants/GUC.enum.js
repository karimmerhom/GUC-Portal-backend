const userTypes = {
  HR: 'HR',
  ACADEMICMEMBER: 'academic member',
}
const memberType = {
  HOD: 'head of department',
  INSTRUCTOR: 'course instructor',
  COORDINATOR: 'course coordinator',
  MEMBER: 'academic member',
}
const position = {
  INSTRUCTOR: 'course instructor',
  COORDINATOR: 'course coordinator',
  MEMBER: 'academic member',
}
const days = {
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
}
const slotNames = {
  FIRST: 'first',
  SECOND: 'second',
  THIRD: 'third',
  FOURTH: 'fourth',
  FIFTH: 'fifth',
}
const locationNames = {
  LECTUREHALL: 'lectureHall',
  OFFICE: 'office',
  ROOM: 'room',
}

const leaveStatus = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PENDING: 'pending',
}

const leaveTypes = {
  ANNUAL: 'annual',
  SICK: 'sick',
  MATERNITY: 'maternity',
  ACCIDENTAL: 'accidental',
}

const slotTypes = {
  LAB: 'lab',
  TUTORIAL: 'tutorial',
  LECTURE: 'lecture',
}


module.exports = {
  leaveTypes,
  leaveStatus,
  position,
  userTypes,
  memberType,
  days,
  slotNames,
  locationNames,
  slotTypes
}
