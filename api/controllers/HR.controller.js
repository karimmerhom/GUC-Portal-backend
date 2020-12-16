const coursesModel = require('../../models/courses.model')
const coursesModel = require('../../models/department.model')

const createCourse = async (req, res) => {
    try {
      const course = req.body
      const courseFound = await coursesModel.findOne({
       courseId: course.courseId,
      })
  
      if (courseFound) {
        return res.json({
          statusCode: 101,
          error: 'already exists',
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
  const updateCourse = async (req, res) => {
    try {
      const course = req.body
      console.log(course)
      const courseFound = await coursesModel.findOne({
       courseId: course.courseId,
      })
      
      if (!courseFound) {
        return res.json({
          statusCode: 101,
          error: 'Course Not Found',
        })
      }
      const id = courseFound.id;
      coursesModel.findByIdAndUpdate(id,course, function (err, result) {
        console.log(err)
        console.log(result)
      })
  
      return res.json({ statusCode: 0000 })
    } catch (exception) {
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
  const deleteCourse = async (req, res) => {
    try {
      const course = req.body
      console.log(course)
      const courseFound = await coursesModel.findOne({
       courseId: course.courseId,
      })
      
      if (!courseFound) {
        return res.json({
          statusCode: 101,
          error: 'Course Not Found',
        })
      }
      const id = courseFound.id;
      coursesModel.findByIdAndRemove(id,course, function (err, result) {
        console.log(err)
        console.log(result)
      })
  
      return res.json({ statusCode: 0000 })
    } catch (exception) {
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
module.exports = {
    createCourse,
    updateCourse,
    deleteCourse
}
