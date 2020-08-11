const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const CoursesModel = require('../../../models/courses.model')
const errorCodes = require('../../constants/errorCodes')
const FormModel = require('../../../models/form.model')
const validator = require('../../helpers/validations/coursesValidations')

const createCourse = async (req, res) => {
  try {
    const { course, Account } = req.body

    const formFound = await FormModel.findOne({
      where: { accountId: Account.id },
    })

    if (!formFound) {
      return res.json({
        statusCode: '1',
        error: 'You must Create a form first',
      })
    }

    const newCourse = {
      title: course.title,
      description: course.description,
      category: course.category,
      attachedMedia: course.attachedMedia,
      durationInHours: course.durationInHours,
      daysPerWeek: course.daysPerWeek,
      sessionDuration: course.sessionDuration,
      pricePerPerson: course.pricePerPerson,
      maxNumberOfAttendees: course.maxNumberOfAttendees,
      minNumberOfAttendees: course.minNumberOfAttendees,
      accountId: Account.id,
    }
    CoursesModel.create(newCourse)
    return res.json({
      statusCode: '0',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: '1',
      error: 'Something went wrong',
    })
  }
}

const viewCourse = async (req, res) => {
  try {
    const courseId = req.body.Course.id
    const checkCourse = await CoursesModel.findOne({
      where: {
        id: courseId,
      },
    })
    if (!checkCourse) {
      return res.json({
        error: 'Course does not exist',
        statusCode: '7',
      })
    }
    return res.json({ Course: checkCourse, statusCode: '0' })
  } catch (exception) {
    return res.json({ error: 'Something went wrong' })
  }
}

const viewAllCourses = async (req, res) => {
  try {
    const result = await CoursesModel.findAll()

    return res.json({ AllCourses: result, statusCode: '0' })
  } catch (exception) {
    return res.json({ error: 'Something went wrong', statusCode: unknown })
  }
}
const editCourse = async (req, res) => {
  try {
    const courseID = req.body.Course.id
    const { Course } = req.body
    const courseid = await CoursesModel.findOne({
      where: {
        id: courseID,
      },
    })
    if (courseid) {
      delete Course.id
      CoursesModel.update(Course, { where: { id: courseID } })
    }

    //console.log(courseUpdate.title),
    return res.json({ msg: 'course is updated', statusCode: '0' })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: '1',
    })
  }
}

module.exports = {
  createCourse,
  viewCourse,
  viewAllCourses,
  editCourse,
}
