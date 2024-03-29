const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const CoursesModel = require('../../../models/courses.model')
const errorCodes = require('../../constants/errorCodes')
const FormModel = require('../../../models/form.model')
const validator = require('../../helpers/validations/coursesValidations')
const Courses = require('../../../models/courses.model')
const coursesValidations = require('../../helpers/validations/coursesValidations')
const { State } = require('../../constants/TBH.enum')

const createCourse = async (req, res) => {
  try {
    const { Course, Account } = req.body

    const formFound = await FormModel.findOne({
      where: { accountId: Account.id },
    })

    if (!formFound) {
      return res.json({
        statusCode: errorCodes.formNotFound,
        error: 'You must Create a form first',
      })
    }

    const newCourse = {
      title: Course.title,
      description: Course.description,
      category: Course.category,
      attachedMedia: Course.attachedMedia,
      durationInHours: Course.durationInHours,
      daysPerWeek: Course.daysPerWeek,
      sessionDuration: Course.sessionDuration,
      pricePerPerson: Course.pricePerPerson,
      maxNumberOfAttendees: Course.maxNumberOfAttendees,
      minNumberOfAttendees: Course.minNumberOfAttendees,
      accountId: Account.id,
      State: Course.State,
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
    const { Account, Course } = req.body
    const { id } = Course
    const type = req.data.type

    const checkCourse = await CoursesModel.findOne({
      where: {
        id,
      },
    })
    if (!checkCourse) {
      return res.json({
        error: 'Course does not exist',
        statusCode: errorCodes.cousrseDoesntExist,
      })
    }
    if (type !== 'admin' && checkCourse.accountId !== Account.id) {
      return res.json({
        error: 'Unauthorized',
        statusCode: errorCodes.unauthorized,
      })
    }

    return res.json({ Course: checkCourse, statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      error: 'Something went wrong',
      statusCode: errorCodes.unknown,
    })
  }
}

const viewAllCourses = async (req, res) => {
  try {
    const { Account, Course } = req.body

    const accountId = req.body.accountId
    const type = req.data.type

    const checkCourse = await CoursesModel.findAll({
      where: {
        accountId,
      },
    })
    if (!checkCourse) {
      return res.json({
        error: 'Account id is not correct',
        statusCode: errorCodes.validation,
      })
    }
    if (type !== 'admin' && accountId !== Account.id) {
      return res.json({
        error: 'Unauthorized',
        statusCode: errorCodes.unauthorized,
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

const viewAllCoursesAdmin = async (req, res) => {
  try {
    const result = await CoursesModel.findAll()

    return res.json({ AllCourses: result, statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      error: 'no courses found',
      statusCode: errorCodes.unknown,
    })
  }
}
const editCourse = async (req, res) => {
  try {
    const { Course, Account } = req.body
    const courseID = Course.id
    const accountId = Account.id

    const courseid = await CoursesModel.findOne({
      where: {
        id: courseID,
        accountId,
      },
    })
    if (!courseid) {
      return res.json({
        msg: 'course doesnt exist for this account',
        statusCode: errorCodes.cousrseDoesntExist,
      })
    }
    if (courseid.State === State.APPROVED) {
      return res.json({
        statusCode: errorCodes.approvedCourse,
        msg: 'Cannot edit course when it is approved',
      })
    }
    CoursesModel.update(Course, { where: { id: courseID, accountId } })

    return res.json({
      msg: 'course is updated',
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: errorCodes.unknown,
    })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const courseID = req.body.Course.id
    const accountId = req.body.Account.id
    const courseid = await CoursesModel.findOne({
      where: {
        id: courseID,
        accountId,
      },
    })
    if (!courseid) {
      return res.json({
        msg: 'course doesnt exist',
        statusCode: errorCodes.cousrseDoesntExist,
      })
    }
    CoursesModel.destroy({ where: { id: courseID, accountId } })
    return res.json({
      msg: 'course is deleted',
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: error.unknown,
    })
  }
}
const stateChange = async (req, res) => {
  try {
    const { Course, Account } = req.body
    const courseID = Course.id
    const accountId = Account.id

    const courseid = await CoursesModel.findOne({
      where: {
        id: courseID,
        accountId,
      },
    })
    if (!courseid) {
      return res.json({
        msg: 'course doesnt exist for this account',
        statusCode: errorCodes.cousrseDoesntExist,
      })
    }
    CoursesModel.update(Course, {
      where: { id: courseID, accountId },
    })
    return res.json({
      msg: 'state is updated',
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: errorCodes.unknown,
    })
  }
}

module.exports = {
  createCourse,
  viewCourse,
  viewAllCourses,
  viewAllCoursesAdmin,
  editCourse,
  deleteCourse,
  stateChange,
}
