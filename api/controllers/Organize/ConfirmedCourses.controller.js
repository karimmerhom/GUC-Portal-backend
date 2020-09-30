const CoursesModel = require('../../../models/confirmedCourses.model')
const errorCodes = require('../../constants/errorCodes')
const FormModel = require('../../../models/form.model')
const { courseStatus } = require('../../constants/TBH.enum')

const createCourse = async (req, res) => {
  try {
    const { Course, accountId } = req.body

    const formFound = await FormModel.findOne({
      where: { accountId },
    })

    if (!formFound) {
      return res.json({
        statusCode: errorCodes.formNotFound,
        error: 'User must Create a form first',
      })
    }
    const courseFound = await CoursesModel.findOne({
      where: {
        title: Course.title,
        eventTitle: Course.eventTitle,
        description: Course.description,
        category: Course.category,
        attachedMediaIn: Course.attachedMediaIn,
        attachedMediaOut: Course.attachedMediaOut,
        durationInHours: Course.durationInHours,
        daysPerWeek: Course.daysPerWeek,
        sessionDuration: Course.sessionDuration,
        numberOfSessions: Course.numberOfSessions,
        startDate: new Date(Course.startDate).toDateString(),
        endDate: new Date(Course.endDate).toDateString(),
        price: Course.price,
        maxNumberOfAttendees: Course.maxNumberOfAttendees,
        minNumberOfAttendees: Course.minNumberOfAttendees,
        teacherName: Course.teacherName,
        location: Course.location,
        accountId,
      },
    })

    if (new Date(Course.startDate)>new Date(Course.endDate)) {
      return res.json({
        statusCode: errorCodes.formNotFound,
        error: 'start date can not be after end date',
      })
    }
    
    if (courseFound) {
      return res.json({
        statusCode: errorCodes.formNotFound,
        error: 'Course Already Exists',
      })
    }
    const newCourse = {
      title: Course.title,
      eventTitle: Course.eventTitle,
      description: Course.description,
      category: Course.category,
      attachedMediaIn: Course.attachedMediaIn,
      attachedMediaOut: Course.attachedMediaOut,
      durationInHours: Course.durationInHours,
      daysPerWeek: Course.daysPerWeek,
      sessionDuration: Course.sessionDuration,
      numberOfSessions: Course.numberOfSessions,
      startDate: new Date(Course.startDate).toDateString(),
      endDate: new Date(Course.endDate).toDateString(),
      dateCreated: new Date().toDateString(),
      price: Course.price,
      maxNumberOfAttendees: Course.maxNumberOfAttendees,
      minNumberOfAttendees: Course.minNumberOfAttendees,
      teacherName: Course.teacherName,
      status: courseStatus.AVAILABLE,
      location: Course.location,
      accountId,
    }
    CoursesModel.create(newCourse)
    return res.json({
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const viewCourse = async (req, res) => {
  try {
    const { Course, Account } = req.body

    const checkCourse = await CoursesModel.findOne({
      where: {
        id: Course.id,
      },
    })
    if (!checkCourse) {
      return res.json({
        error: 'Course does not exist',
        statusCode: errorCodes.cousrseDoesntExist,
      })
    }

    return res.json({ Course: checkCourse, statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: errorCodes.unknown,
    })
  }
}

const viewAllCourses = async (req, res) => {
  try {
    const checkCourse = await CoursesModel.findAll({})
    if (!checkCourse) {
      return res.json({
        error: 'No Courses Yet',
        statusCode: errorCodes.validation,
      })
    }
    return res.json({ AllCourses: checkCourse, statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: errorCodes.unknown,
    })
  }
}

module.exports = {
  viewCourse,
  viewAllCourses,
  createCourse,
}
