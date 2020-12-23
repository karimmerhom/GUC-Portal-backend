//const updateDepartment = async (req, res) => lama ussef ye5alas beoble

const errorCodes = require('../constants/errorCodes')
const { userTypes, memberType, days } = require('../constants/GUC.enum')

const coursesModel = require('../../models/courses.model')
const departmentModel = require('../../models/department.model')
const staffCoursesModel = require('../../models/staffCourses.model')
const locationModel = require('../../models/locations.model')
const slotsModel = require('../../models/slots.modal')
const accountsModel = require('../../models/account.model')

//create slot
const createSlot = async (req, res) => {
  try {
    const Account = req.body.Account
    const slot = req.body.slot

    const course = await coursesModel.findOne({
      name: slot.courseName,
    })

    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }

    const staffCourse = await staffCoursesModel.findOne({
      courseName: course.name,
      academicId: Account.academicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not your course ya coordinator',
      })
    }

    const location = await locationModel.findOne({ name: slot.locationName })
    console.log(slot)
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
    })

    if (sameSlotFound) {
      return res.json({
        statusCode: errorCodes.slotTaken,
        error: 'Same slot found/ slot is taken',
      })
    }

    const newslot = await slotsModel.create(slot, function (err, result) {
      console.log(err)
      console.log(result)
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
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
        name: slot.courseName,
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
      courseName: course.name,
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
      console.log(slot)
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
    console.log(exception)
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
    // const instructorsCourse = await staffCoursesModel.findOne({//check if that instructor is assigned to that course
    //   courseName: course.name,
    //   academicId: Account.academicId,
    // })

    // if (!instructorsCourse) {
    //   return res.json({
    //     statusCode: errorCodes.notYourCourse,
    //     error: 'This is not your course ya instructor',
    //   })
    // }

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
    // //check if that ataff is assigned to that course
    // const staffCourse = await staffCoursesModel.findOne({
    //   courseName: sameSlotFound.courseName,
    //   academicId: Account.academicId,
    // })

    // if (!staffCourse) {
    //   return res.json({
    //     statusCode: errorCodes.notYourCourse,
    //     error: 'This is not the staff members course',
    //   })
    // }

    //check if slot is already assigned to someone
    if (sameSlotFound.assignedAcademicId) {
      return res.json({
        statusCode: errorCodes.slotAssigned,
        error: 'Slot already assigned',
      })
    }

    sameSlotFound.assignedAcademicId = assignedAcademicId
    console.log(sameSlotFound)

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
    // const instructorsCourse = await staffCoursesModel.findOne({//check if that instructor is assigned to that course
    //   courseName: course.name,
    //   academicId: Account.academicId,
    // })

    // if (!instructorsCourse) {
    //   return res.json({
    //     statusCode: errorCodes.notYourCourse,
    //     error: 'This is not your course ya instructor',
    //   })
    // }

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
    // //check if that ataff is assigned to that course
    // const staffCourse = await staffCoursesModel.findOne({
    //   courseName: sameSlotFound.courseName,
    //   academicId: Account.academicId,
    // })

    // if (!staffCourse) {
    //   return res.json({
    //     statusCode: errorCodes.notYourCourse,
    //     error: 'This is not the staff members course',
    //   })
    // }

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

    // const staffCourse = await staffCoursesModel.findOne({
    //   courseName: course.name,
    //   academicId: Account.academicId,
    // })

    // if (!staffCourse) {
    //   return res.json({
    //     statusCode: errorCodes.notYourCourse,
    //     error: 'This is not your course ya coordinator',
    //   })
    // }

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

    slotsModel.deleteOne(sameSlotFound, function (err, result) {
      console.log(err)
      console.log(result)
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

module.exports = {
  createSlot,
  deleteSlot,
  assignSlot,
  reAssignSlot,
  updateSlot,
}
