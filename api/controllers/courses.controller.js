//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty 
const coursesModel = require('../../models/courses.model')
const departmentModel = require('../../models/department.model')
const staffCoursesModel = require('../../models/satffCourses')

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
       department: course.department
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
       department: course.department
      })
  
      if (!courseFound) {
        return res.json({
          statusCode: 101,
          error: 'course not found',
        })
      }
      staffCoursesModel.deleteMany({ course : course.id })
      coursesModel.findByIdAndDelete(course.courseId, function (err, result) {
        console.log(err)
        console.log(result)
      })

      

      return res.json({ statusCode: 0000 })
    } 
      catch (exception) {
      console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }

  const updateCourse = async (req, res) => {
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
       department: course.department
      })
  
      if (!courseFound) {
        return res.json({
          statusCode: 101,
          error: 'course not found',
        })
      }
  
      coursesModel.findByIdAndUpdate(courseFound.id, course, function (err, result) {
        console.log(err)
        console.log(result)
      })
      
      

      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
  module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
}