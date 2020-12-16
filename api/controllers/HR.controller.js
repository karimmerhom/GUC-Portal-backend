//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty 
const coursesModel = require('../../models/courses.model')
const departmentModel = require('../../models/department.model')

const facultyModel = require('../../models/faculty.model')

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
  
      coursesModel.findByIdAndDelete(course.courseId, function (err, result) {
        console.log(err)
        console.log(result)
      })

      var foundIndex = departmentFound.courses.findIndex(x => x.courseId == course.courseId);
      departmentFound.courses.splice(foundIndex, 1);
      departmentModel.findByIdAndUpdate(departmentFound.id,departmentFound, function (err, result) {
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
      
      var foundIndex = departmentFound.courses.findIndex(x => x.courseId == course.courseId);
      const oldCourse = departmentFound.courses[foundIndex] ;
      if(course.creditHours != null){
        oldCourse.creditHours = course.creditHours
      }
      if(course.courseName != null){
        oldCourse.courseName = course.courseName
      }

      
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
  const deleteDepartment = async (req, res) =>{
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
  
   
      if (!departmentFound) {
        return res.json({
          statusCode: 101,
          error: 'department not found',
        })
      }
      await departmentModel.findByIdAndDelete(departmentFound.id, function (err, result) {
        console.log(err)
        console.log(result)
      })
    
      var foundIndex = facultyFound.departments.findIndex(x => x.name == departmentFound.name);
      facultyFound.departments.splice(foundIndex, 1);
     
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
    deleteDepartment,
    createDepartment,
}
