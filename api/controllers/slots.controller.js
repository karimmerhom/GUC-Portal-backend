//const updateDepartment = async (req, res) => lama ussef ye5alas beoble

const errorCodes = require('../constants/errorCodes')
const {
  userTypes,
  memberType,
  days,
  slotNames,
  leaveStatus,
} = require('../constants/GUC.enum')
const moment = require('moment')

const coursesModel = require('../../models/courses.model')
const departmentModel = require('../../models/department.model')
const staffCoursesModel = require('../../models/staffCourses.model')
const locationModel = require('../../models/locations.model')
const slotsModel = require('../../models/slots.modal')
const accountsModel = require('../../models/account.model')
const compensationRequestsModel = require('../../models/replacementsRequests.model')

//create slot
const createSlot = async (req, res) => {
  try {
    const Account = req.body.Account
    const slot = req.body.slot

    const course = await coursesModel.findOne({
      courseId: slot.courseId,
    })

    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }

    const staffCourse = await staffCoursesModel.findOne({
      courseId: course.courseId,
      academicId: Account.academicId,
    })

    console.log(staffCourse)

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not your course ya coordinator',
      })
    }

    const location = await locationModel.findOne({ name: slot.locationName })
    if (!location) {
      return res.json({
        statusCode: errorCodes.LocationNotFound,
        error: 'location not found',
      })
    }

    //check location is not an office!!!!!!!!

    const sameSlotFound = await slotsModel.findOne({
      day: slot.day,
      slot: slot.slot,
      locationName: slot.locationName,
      slotType: slot.slotType,
    })

    if (sameSlotFound) {
      return res.json({
        statusCode: errorCodes.slotTaken,
        error: 'Same slot found/ slot is taken',
      })
    }

    const newslot = await slotsModel.create(slot)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const updateSlot = async (req, res) => {
  try {
    const Account = req.body.Account
    const slot = req.body.slot

    const sameSlotFound = await slotsModel.findById(slot.id)

    if (!sameSlotFound) {
      return res.json({
        statusCode: errorCodes.slotNotFound,
        error: 'slot not found to update',
      })
    }

    if (slot.course) {
      const course = await coursesModel.findOne({
        courseId: slot.courseId,
      })

      if (!course) {
        return res.json({
          statusCode: errorCodes.courseNotFound,
          error: 'course not found',
        })
      }
      sameSlotFound.course = slot.course
    }

    const staffCourse = await staffCoursesModel.findOne({
      courseId: course.courseId,
      academicId: Account.academicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not your course ya coordinator',
      })
    }
    if (slot.location) {
      const location = await locationModel.findOne({ name: slot.locationName })
      if (!location) {
        return res.json({
          statusCode: errorCodes.LocationNotFound,
          error: 'location not found',
        })
      }
      sameSlotFound.location = slot.location
    }

    const sameSlotFound1 = await slotsModel.findOne({
      day: sameSlotFound.day,
      slot: sameSlotFound.slot,
      locationName: sameSlotFound.locationName,
    })

    if (sameSlotFound1) {
      return res.json({
        statusCode: errorCodes.slotTaken,
        error: 'Same slot found/ slot is taken',
      })
    }

    slotsModel.findByIdAndUpdate(slot.id, sameSlotFound)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const assignSlot = async (req, res) => {
  try {
    const Account = req.body.Account
    const slot = req.body.slot
    const assignedAcademicId = req.body.assignedAcademicId

    const academicMem = await accountsModel.findOne({
      academicId: assignedAcademicId,
    })

    //check if account exists
    if (!academicMem) {
      return res.json({
        statusCode: errorCodes.accountDoesNotExist,
        error: 'This academic member doesnt exist',
      })
    }
    //check if academic member
    if (
      !(
        academicMem.type === userTypes.ACADEMICMEMBER &&
        academicMem.memberType === memberType.MEMBER
      )
    ) {
      return res.json({
        statusCode: errorCodes.wrongUserType,
        error: 'This is not an academic member',
      })
    }
    const sameSlotFound = await slotsModel.findOne({
      day: slot.day,
      slot: slot.slot,
      locationName: slot.locationName,
    })
    //check if slot exists
    if (!sameSlotFound) {
      return res.json({
        statusCode: errorCodes.slotTaken,
        error: 'Slot not found',
      })
    }
    const instructorsCourseAssigned = await staffCoursesModel.findOne({
      //check if that instructor is assigned to that course
      courseId: sameSlotFound.courseId,
      academicId: req.body.assignedAcademicId,
    })
    if (!instructorsCourseAssigned) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is course is not assigned to this academic member',
      })
    }

    const instructorsCourse = await staffCoursesModel.findOne({
      //check if that instructor is assigned to that course
      courseId: sameSlotFound.courseId,
      academicId: Account.academicId,
    })

    if (!instructorsCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not your course ya instructor',
      })
    }
    //check if that ataff is assigned to that course
    const staffCourse = await staffCoursesModel.findOne({
      courseId: sameSlotFound.courseId,
      academicId: Account.academicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not the staff members course',
      })
    }

    //check if slot is already assigned to someone
    if (sameSlotFound.assignedAcademicId) {
      return res.json({
        statusCode: errorCodes.slotAssigned,
        error: 'Slot already assigned',
      })
    }

    sameSlotFound.assignedAcademicId = assignedAcademicId

    const updated = await slotsModel.findByIdAndUpdate(
      sameSlotFound._id,
      sameSlotFound
    )

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const unAssignSlot = async (req, res) => {
  try {
    const Account = req.body.Account
    const slot = req.body.slot

    const sameSlotFound = await slotsModel.findOne({
      day: slot.day,
      slot: slot.slot,
      locationName: slot.locationName,
    })

    //check if that instructor is assigned to that course
    const instructorsCourse = await staffCoursesModel.findOne({
      courseId: sameSlotFound.courseId,
      academicId: Account.academicId,
    })

    if (!instructorsCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not your course ya instructor',
      })
    }
    //check if slot exists
    if (!sameSlotFound) {
      return res.json({
        statusCode: errorCodes.slotTaken,
        error: 'Slot not found',
      })
    }
    //check if that ataff is assigned to that course

    //check if slot is already assigned to someone
    if (!sameSlotFound.assignedAcademicId) {
      return res.json({
        statusCode: errorCodes.slotNotFound,
        error: 'Slot not assigned',
      })
    }
    delete sameSlotFound.academicId

    const updated = await slotsModel.findByIdAndUpdate(
      sameSlotFound._id,
      sameSlotFound
    )

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const reAssignSlot = async (req, res) => {
  try {
    const Account = req.body.Account
    const slot = req.body.slot
    const assignedAcademicId = req.body.assignedAcademicId

    const academicMem = await accountsModel.findOne({
      academicId: assignedAcademicId,
    })

    //check if account exists
    if (!academicMem) {
      return res.json({
        statusCode: errorCodes.accountDoesNotExist,
        error: 'This academic member doesnt exist',
      })
    }
    //check if academic member
    if (
      !(
        academicMem.type === userTypes.ACADEMICMEMBER &&
        academicMem.memberType === memberType.MEMBER
      )
    ) {
      return res.json({
        statusCode: errorCodes.wrongUserType,
        error: 'This is not an academic member',
      })
    }
    const sameSlotFound = await slotsModel.findOne({
      day: slot.day,
      slot: slot.slot,
      locationName: slot.locationName,
    })
    //check if slot exists
    if (!sameSlotFound) {
      return res.json({
        statusCode: errorCodes.slotTaken,
        error: 'Slot not found',
      })
    }
    //check if that ataff is assigned to that course
    const staffCourse = await staffCoursesModel.findOne({
      courseId: sameSlotFound.courseId,
      academicId: Account.academicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not the staff members course',
      })
    }

    const instructorsCourse = await staffCoursesModel.findOne({
      //check if that instructor is assigned to that course
      courseId: sameSlotFound.courseId,
      academicId: Account.academicId,
    })

    if (!instructorsCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not your course ya instructor',
      })
    }

    sameSlotFound.assignedAcademicId = assignedAcademicId

    const updated = await slotsModel.findByIdAndUpdate(
      sameSlotFound._id,
      sameSlotFound
    )

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)

    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const deleteSlot = async (req, res) => {
  try {
    const Account = req.body.Account
    const slot = req.body.slot

    const sameSlotFound = await slotsModel.findOne({
      day: slot.day,
      slot: slot.slot,
      locationName: slot.locationName,
    })

    if (!sameSlotFound) {
      return res.json({
        statusCode: errorCodes.slotNotFound,
        error: 'slot doesnot exist',
      })
    }

    const staffCourse = await staffCoursesModel.findOne({
      courseId: sameSlotFound.courseId,
      academicId: Account.academicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not your course ya coordinator',
      })
    }

    const deleted = await slotsModel.findByIdAndDelete(sameSlotFound.id)
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
const viewSchedule = async (req, res) => {
  try {
    const Account = req.body.Account

    const account = await accountsModel.findOne({
      academicId: Account.academicId,
    })
    let weekday = new Array(7)
    weekday[0] = days.SATURDAY
    weekday[1] = days.SUNDAY
    weekday[2] = days.MONDAY
    weekday[3] = days.TUESDAY
    weekday[4] = days.WEDNESDAY
    weekday[5] = days.THURSDAY

    const ScheduleList = []

    for (var i = 0; i < 6; i++) {
      var wday = weekday[i]
      if (wday === account.dayOff) {
        ScheduleList[i] = { day: wday, dayOff: true }
      } else {
        day = {
          day: wday,
          firstSlot: await slotsModel.findOne({
            assignedAcademicId: Account.academicId,
            day: wday,
            slot: slotNames.FIRST,
          }),
          secondSlot: await slotsModel.findOne({
            assignedAcademicId: Account.academicId,
            day: wday,
            slot: slotNames.SECOND,
          }),
          thirdSlot: await slotsModel.findOne({
            assignedAcademicId: Account.academicId,
            day: wday,
            slot: slotNames.THIRD,
          }),
          fourthSlot: await slotsModel.findOne({
            assignedAcademicId: Account.academicId,
            day: wday,
            slot: slotNames.FOURTH,
          }),
          fifthSlot: await slotsModel.findOne({
            assignedAcademicId: Account.academicId,
            day: wday,
            slot: slotNames.FIFTH,
          }),
        }

        ScheduleList[i] = day
      }
    }

    //loop back to saturday
    var day = moment().add(1, 'day')

    while (day.format('dddd').toLowerCase() !== days.SATURDAY) {
      day = day.add(-1, 'day')
    }
    for (var i = 0; i < 6; i++) {
      var wd = weekday[i]
      const d = `${day.year()}-${day.month() + 1}-${day.date()}T00:00:00.0000`
      const reqs = await compensationRequestsModel.find({
        date: d,
        academicIdReciever: Account.academicId,
        hodStatus: leaveStatus.ACCEPTED,
      })
      console.log(reqs)

      for (var j = 0; j < reqs.length; j++) {
        const slot = await slotsModel.findById(reqs[j].slotId)
        if (slot.slot === slotNames.FIRST) {
          ScheduleList[i].firstSlot = slot
        }
        if (slot.slot === slotNames.SECOND) {
          ScheduleList[i].secondSlot = slot
        }
        if (slot.slot === slotNames.THIRD) {
          ScheduleList[i].thirdSlot = slot
        }
        if (slot.slot === slotNames.FOURTH) {
          ScheduleList[i].fourthSlot = slot
        }
        if (slot.slot === slotNames.FIFTH) {
          ScheduleList[i].fifthSlot = slot
        }
      }
      day = day.add(1, 'day')
    }

    return res.json({ statusCode: errorCodes.success, Schedule: ScheduleList })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
module.exports = {
  viewSchedule,
  createSlot,
  deleteSlot,
  assignSlot,
  reAssignSlot,
  updateSlot,
  unAssignSlot,
}
