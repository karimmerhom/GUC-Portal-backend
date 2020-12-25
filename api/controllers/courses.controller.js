//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty
const accountsModel = require('../../models/account.model')
const coursesModel = require('../../models/courses.model')
const departmentModel = require('../../models/department.model')
const slotsModel = require('../../models/slots.modal')
const staffCoursesModel = require('../../models/staffCourses.model')
const slotLinkingModel = require('../../models/slotLinking.model')
const replacementsRequestsModel = require('../../models/replacementsRequests.model')
const errorCodes = require('../constants/errorCodes')

const {
  userTypes,
  memberType,
  days,
  slotNames,
} = require('../constants/GUC.enum')
const { position } = require('../constants/GUC.enum')

const createCourse = async (req, res) => {
  try {
    const course = req.body
    const departmentFound = await departmentModel.findOne({
      name: course.department,
    })

    if (!departmentFound) {
      return res.json({
        statusCode: 101,
        error: 'department not found',
      })
    }
    const courseFound = await coursesModel.findOne({
      courseId: course.courseId,
    
    })

    if (courseFound) {
      return res.json({
        statusCode: 101,
        error: 'course already exists',
      })
    }

    coursesModel.create(course, function (err, result) {
      console.log(err)
      console.log(result)
    })

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const course = req.body
 
    const courseFound = await coursesModel.findOne({
      courseId: course.courseId,
    })

    if (!courseFound) {
      return res.json({
        statusCode: 101,
        error: 'course not found',
      })
    }
    console.log(course.courseId)
    await staffCoursesModel.deleteMany({ courseId: course.courseId }) //delete all related course linkage
    const slotsDeleted = await slotsModel.find({ courseId: course.courseId }) 
    await slotsModel.deleteMany({  courseId: course.courseId }) 
    console.log(slotsDeleted)
    console.log("here")
    console.log(course.courseId)
    for(var i = 0 ; i< slotsDeleted.length ; i++)
    {
      await slotLinkingModel.deleteMany({ slotId: slotsDeleted[i].id })
      await replacementsRequestsModel.deleteMany({ slotId: slotsDeleted[i].id })
    }
   await coursesModel.findByIdAndDelete(courseFound.id, function (err, result) {
      console.log(err)
      console.log(result)
    })

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const updateCourse = async (req, res) => {
  try {
    const course = req.body
    const courseFound = await coursesModel.findOne({
      courseId: course.courseId,
    
    })
    
    if (!courseFound) {
      return res.json({
        statusCode: 101,
        error: 'course not found',
      })
    }
   
    coursesModel.findByIdAndUpdate(
      courseFound.id,
      course,
      function (err, result) {
        console.log(err)
        console.log(result)
      }
    )

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const assignCourseCoordinator = async (req, res) => {
  try {
    const Account = req.body.Account
    const courseId = req.body.courseId
    const assignedAcademicId = req.body.assignedAcademicId

    const INST = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    const academicMem = await accountsModel.findOne({
      academicId: assignedAcademicId,
    })
    //check if account exists
    if (!academicMem) {
      return res.json({
        statusCode: errorCodes.accountDoesNotExist,
        error: 'This academic coordinator doesnt exist',
      })
    }
    //check if academic coordinator
    if (
      !(
        academicMem.type === userTypes.ACADEMICMEMBER &&
        academicMem.memberType === memberType.COORDINATOR
      )
    ) {
      return res.json({
        statusCode: errorCodes.wrongUserType,
        error: 'This is not an academic coordinator',
      })
    }

    const course = await coursesModel.findOne({
      courseId: courseId,
    })
    //check if course exists
    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }
    //check if inst's course
    const staffCourseINST = await staffCoursesModel.findOne({
      courseId: courseId,
      position: position.INSTRUCTOR,
      academicId: Account.academicId,
    })

    if (!staffCourseINST) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'not the instructors course',
      })
    }

    //check if coordinator already exists
    const staffCourse = await staffCoursesModel.findOne({
      courseId: courseId,
      position: position.COORDINATOR,
    })

    if (staffCourse) {
      return res.json({
        statusCode: errorCodes.coordinatorAlreadyExists,
        error: 'coordinator already exists',
      })
    }

    const newStaffCourse = await staffCoursesModel.create({
      academicId: assignedAcademicId,
      courseId: courseId,
      position: position.COORDINATOR,
    })

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const assignCourseMember = async (req, res) => {
  try {
    const Account = req.body.Account
    const courseId = req.body.courseId
    const assignedAcademicId = req.body.assignedAcademicId

    const INST = await accountsModel.findOne({
      academicId: Account.academicId,
    })

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
    //check if academic coordinator
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

    const course = await coursesModel.findOne({
      courseId: courseId,
    })
    //check if course exists
    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }
    //check if inst's course
    if (course.department !== INST.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'not the instructors department',
      })
    }

    //check if instructor's course already exists
    const staffCourseINST = await staffCoursesModel.findOne({
      courseId: courseId,
      position: position.INSTRUCTOR,
      academicId: Account.academicId,
    })

    if (!staffCourseINST) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'not the instructors course',
      })
    }

    //check if coordinator already exists
    const staffCourse = await staffCoursesModel.findOne({
      courseId: courseId,
      position: position.MEMBER,
      academicId: assignedAcademicId,
    })

    if (staffCourse) {
      return res.json({
        statusCode: errorCodes.memberAlreadyAssigned,
        error: 'Member already exists',
      })
    }

    const newStaffCourse = await staffCoursesModel.create({
      academicId: assignedAcademicId,
      courseId: courseId,
      position: position.MEMBER,
    })

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const assignCourseInstructor = async (req, res) => {
  try {
    const Account = req.body.Account
    const courseId = req.body.courseId
    const assignedAcademicId = req.body.assignedAcademicId

    const HOD = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    const academicMem = await accountsModel.findOne({
      academicId: assignedAcademicId,
    })
    //check if account exists
    if (!academicMem) {
      return res.json({
        statusCode: errorCodes.accountDoesNotExist,
        error: 'This academic Instructor doesnt exist',
      })
    }
    //check if academic instructor
    if (
      !(
        academicMem.type === userTypes.ACADEMICMEMBER &&
        academicMem.memberType === memberType.INSTRUCTOR
      )
    ) {
      return res.json({
        statusCode: errorCodes.wrongUserType,
        error: 'This is not an academic instructor',
      })
    }

    const course = await coursesModel.findOne({
      courseId: courseId,
    })
    //check if course exists
    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }
    //check if HOD's department
    if (course.department !== HOD.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'not the HODs department',
      })
    }
    //check if INSTRUCTOR already exists
    const staffCourse = await staffCoursesModel.findOne({
      courseId: courseId,
      position: position.INSTRUCTOR,
    })

    const newStaffCourse = await staffCoursesModel.create({
      academicId: assignedAcademicId,
      courseId: courseId,
      position: position.INSTRUCTOR,
    })

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const updateCourseInstructor = async (req, res) => {
  try {
    const Account = req.body.Account
    const courseId = req.body.courseId
    const assignedAcademicId = req.body.assignedAcademicId

    const HOD = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    const academicMem = await accountsModel.findOne({
      academicId: assignedAcademicId,
    })
    //check if account exists
    if (!academicMem) {
      return res.json({
        statusCode: errorCodes.accountDoesNotExist,
        error: 'This academic Instructor doesnt exist',
      })
    }
    //check if academic coordinator
    if (
      !(
        academicMem.type === userTypes.ACADEMICMEMBER &&
        academicMem.memberType === memberType.INSTRUCTOR
      )
    ) {
      console.log(academicMem.memberType)
      return res.json({
        statusCode: errorCodes.wrongUserType,
        error: 'This is not an academic instructor',
      })
    }

    const course = await coursesModel.findOne({
      courseId: courseId,
    })
    //check if course exists
    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }
    //check if HOD's department
    if (course.department !== HOD.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'not the HODs department',
      })
    }
    //check if coordinator already exists
    const staffCourse = await staffCoursesModel.findOne({
      courseId: courseId,
      position: position.INSTRUCTOR,
    })

    const newStaffCourse = await staffCoursesModel.findByIdAndUpdate(
      staffCourse._id,
      {
        academicId: assignedAcademicId,
        courseId: courseId,
        position: position.INSTRUCTOR,
      }
    )

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const unassignCourseInstructor = async (req, res) => {
  try {
    const Account = req.body.Account
    const courseId = req.body.courseId
    const assignedAcademicId = req.body.assignedAcademicId

    const HOD = await accountsModel.findOne({
      academicId: Account.academicId,
    })

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
        academicMem.memberType === memberType.INSTRUCTOR
      )
    ) {
      return res.json({
        statusCode: errorCodes.wrongUserType,
        error: 'This is not an academic instructor',
      })
    }

    const course = await coursesModel.findOne({
      courseId: courseId,
    })
    //check if course exists
    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }

    //check if HOD's department
    if (course.department !== HOD.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'not the HODs department',
      })
    }
    //check if assignment exists
    const staffCourse = await staffCoursesModel.create({
      courseId: courseId,
      academicId: assignedAcademicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.assignmentDoesNotExist,
        error: 'This asignment does not exist',
      })
    }

    const newStaffCourse = await staffCoursesModel.findByIdAndDelete(
      staffCourse.id
    )

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const unassignCourseCoordinator = async (req, res) => {
  try {
    const Account = req.body.Account
    const courseId = req.body.courseId
    const assignedAcademicId = req.body.assignedAcademicId

    const INST = await accountsModel.findOne({
      academicId: Account.academicId,
    })

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
        academicMem.memberType === memberType.COORDINATOR
      )
    ) {
      return res.json({
        statusCode: errorCodes.wrongUserType,
        error: 'This is not an academic coordinator',
      })
    }

    const course = await coursesModel.findOne({
      courseId: courseId,
    })
    //check if course exists
    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }

    //check if HOD's department
    if (course.department !== INST.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'not the INST department',
      })
    }

    const staffCourseINST = await staffCoursesModel.findOne({
      courseId: courseId,
      position: position.INSTRUCTOR,
      academicId: Account.academicId,
    })

    if (!staffCourseINST) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'not the instructors course',
      })
    }
    //check if assignment exists
    const staffCourse = await staffCoursesModel.create({
      courseId: courseId,
      academicId: assignedAcademicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.assignmentDoesNotExist,
        error: 'This asignment does not exist',
      })
    }

    const newStaffCourse = await staffCoursesModel.findByIdAndDelete(
      staffCourse.id
    )

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const unassignCourseMember = async (req, res) => {
  try {
    const Account = req.body.Account
    const courseId = req.body.courseId
    const assignedAcademicId = req.body.assignedAcademicId

    const INST = await accountsModel.findOne({
      academicId: Account.academicId,
    })

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
    const staffCourseINST = await staffCoursesModel.findOne({
      courseId: courseId,
      position: position.INSTRUCTOR,
      academicId: Account.academicId,
    })

    if (!staffCourseINST) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'not the instructors course',
      })
    }

    const course = await coursesModel.findOne({
      courseId: courseId,
    })
    //check if course exists
    if (!course) {
      return res.json({
        statusCode: errorCodes.courseNotFound,
        error: 'course not found',
      })
    }

    //check if INST's department
    if (course.department !== INST.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'not the INST department',
      })
    }
    //check if assignment exists
    const staffCourse = await staffCoursesModel.create({
      courseId: courseId,
      academicId: assignedAcademicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.assignmentDoesNotExist,
        error: 'This asignment does not exist',
      })
    }

    const newStaffCourse = await staffCoursesModel.findByIdAndDelete(
      staffCourse.id
    )

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

module.exports = {
  unassignCourseMember,
  unassignCourseCoordinator,
  unassignCourseInstructor,
  assignCourseCoordinator,
  assignCourseInstructor,
  assignCourseMember,
  updateCourseInstructor,
  createCourse,
  updateCourse,
  deleteCourse,
}
