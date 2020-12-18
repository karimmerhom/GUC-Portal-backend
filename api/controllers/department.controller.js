//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty 
const departmentModel = require('../../models/department.model')
const facultyModel = require('../../models/faculty.model')
  
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

  
module.exports = {
    deleteDepartment,
    createDepartment,
}
