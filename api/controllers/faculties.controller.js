//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty 
const facultyModel = require('../../models/faculty.model')
const departmentModel = require('../../models/department.model')
const coursesModel = require('../../models/courses.model')
const AccountModel = require('../../models/account.model')

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

  const deleteFaculty = async (req, res) => {
    try {
      const faculty = req.body
      const facultyFound = await facultyModel.findOne({
       name: faculty.name,
      })
  
      if (!facultyFound) {
        return res.json({
          statusCode: 101,
          error: 'Faculty not found',
        })
      }
  
      facultyModel.findByIdAndDelete(facultyFound.id, function (err, result) {
        console.log(err)
        console.log(result)
      })
      const departmentsFound = await departmentModel.find({
        faculty: faculty.name,
       })
       for( var i =0 ; i<departmentsFound.length ; i ++)
       {
        departmentModel.findByIdAndUpdate(departmentsFound[i].id, {faculty: null} ,function (err, result) {
          console.log(err)
          console.log(result)
        })
        const coursesFound = await coursesModel.find({
          department: departmentsFound[i].name,
         })
         for( var i =0 ; i<coursesFound.length ; i ++)
         {
          coursesModel.findByIdAndDelete(coursesFound[i].id, function (err, result) {
            console.log(err)
            console.log(result)
          })
          
         }
        
       }
      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }

  const updateFaculty = async (req, res) => {
    try {
      const faculty = req.body
      const facultyFound = await facultyModel.findOne({
       name: faculty.name,
      })
  
      if (!facultyFound) {
        return res.json({
          statusCode: 101,
          error: 'Faculty not found',
        })
      }
      const facultyNewFound = await facultyModel.findOne({
        name: faculty.faculty.name,
       })
  
       if (facultyNewFound) {
        return res.json({
          statusCode: 101,
          error: 'new faculty exists',
        })
      }
      facultyModel.findByIdAndUpdate(facultyFound.id,faculty.faculty, function (err, result) {
        console.log(err)
        console.log(result)
      })
      const departmentsFound = await departmentModel.find({
        faculty: faculty.name,
       })
       for( var i =0 ; i<departmentsFound.length ; i ++)
       {
        const newDepartment = departmentsFound[i] 
        newDepartment.faculty = faculty.faculty.name
        departmentModel.findByIdAndUpdate(departmentsFound[i].id,newDepartment, function (err, result) {
          console.log(err)
          console.log(result)
        })
        
        
       }
      return res.json({ statusCode: 0000 })
    } catch (exception) {
        console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }

  module.exports = {
    createFaculty,
    deleteFaculty,
    updateFaculty

}