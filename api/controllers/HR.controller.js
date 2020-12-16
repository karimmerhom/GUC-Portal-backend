// creating courses , departments tables 3shan homa gwa faculty 
const coursesModel = require('../../models/courses.model')
const departmentModel = require('../../models/department.model')
<<<<<<< HEAD
=======
const facultyModel = require('../../models/faculty.model')
>>>>>>> 4ee8ea56d318f1e795cc2e8337bccd1b61c731ad

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

      departmentFound.courses.push(course)
      departmentModel.findByIdAndUpdate(departmentFound.id,departmentFound, function (err, result) {
        console.log(err)
        console.log(result)
      })

      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
  const createDepartment = async (req, res) => {
    try {
      const department = req.body
      const facultyFound = await facultyModel.findOne({
       name: department.faculty,
      })
  
      if (!facultyFound) {
        return res.json({
          statusCode: 101,
          error: 'faculty not found',
        })
      }
      const departmentFound = await departmentModel.findOne({
        name: department.name,
        faculty : department.faculty
       })
  
   
      if (departmentFound) {
        return res.json({
          statusCode: 101,
          error: 'department already exists',
        })
      }
      await departmentModel.create(department, function (err, result) {
        console.log(err)
        console.log(result)
      })
    
      facultyFound.departments.push(department)
      facultyModel.findByIdAndUpdate(facultyFound.id,facultyFound, function (err, result) {
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

  const createFaculty = async (req, res) => {
    try {
      const faculty = req.body
      const facultyFound = await facultyModel.findOne({
       name: faculty.name,
      })
  
      if (facultyFound) {
        return res.json({
          statusCode: 101,
          error: 'already exists',
        })
      }
  
      facultyModel.create(faculty, function (err, result) {
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
    createFaculty,
    createDepartment,
}
