const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const CoursesModel = require('../../../models/courses.model')
const errorCodes = require('../../constants/errorCodes')
const FormModel = require('../../../models/form.model')
const validator = require('../../helpers/validations/coursesValidations')
const createCourse = async (req, res) => {
  try {
    const { Course, Account } = req.body

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
      maxNumerOfAttendees: course.maxNumerOfAttendees,
      minNumerOfAttendees: course.minNumerOfAttendees,
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

module.exports = {
  createCourse,
}
