//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty
const departmentModel = require('../../models/department.model')
const facultyModel = require('../../models/faculty.model')
const coursesModel = require('../../models/courses.model')
const accountsModel = require('../../models/account.model')

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
      faculty: department.faculty,
    })

    if (departmentFound) {
      return res.json({
        statusCode: 101,
        error: 'department already exists',
      })
    }
    // const headOfDepartment = await departmentModel.findOne({
    //   name: department.name,
    //   faculty: department.faculty,
    // })
    await departmentModel.create(department, function (err, result) {
      console.log(err)
      console.log(result)
    })

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
//when deleting a department all courses under the department will be deleted
const deleteDepartment = async (req, res) => {
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
      faculty: department.faculty,
    })

    if (!departmentFound) {
      return res.json({
        statusCode: 101,
        error: 'department not found',
      })
    }
    await departmentModel.findByIdAndDelete(
      departmentFound.id,
      function (err, result) {
        console.log(err)
        console.log(result)
      }
    )
    const coursesFound = await coursesModel.find({
      department: department.name,
    })
    for (var i = 0; i < coursesFound.length; i++) {
      coursesModel.findByIdAndUpdate(coursesFound[i].id,
        {department: null},
        function (err, result) {
          console.log(err)
          console.log(result)
        }
      )
    }

    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const updateDepartment = async (req, res) => {
  try {
    const department = req.body
    const facultyFound = await facultyModel.findOne({
      name: department.faculty,
    })
    const facultyNewFound = await facultyModel.findOne({
      name: department.department.faculty,
    })
    const accountsWithDepartment =await accountsModel.find({
      department: department.name
    })

    if (!facultyFound) {
      return res.json({
        statusCode: 101,
        error: 'faculty not found',
      })
    }
    if (!facultyNewFound) {
      return res.json({
        statusCode: 101,
        error: 'new faculty not found',
      })
    }
    const departmentFound = await departmentModel.findOne({
      name: department.name,
      faculty: department.faculty,
    })
    const departmentNewFound = await departmentModel.findOne({
      name: department.name,
      faculty: department.department.faculty,
    })

    if (!departmentFound) {
      return res.json({
        statusCode: 101,
        error: 'department not found',
      })
    }
    if (!departmentNewFound) {
      return res.json({
        statusCode: 101,
        error: 'new department not found',
      })
    }
    await departmentModel.findByIdAndUpdate(
      departmentFound.id,
      department.department,
      function (err, result) {
        console.log(err)
        console.log(result)
      }
    )
    if (department.department.name != null) {
      const coursesFound = await coursesModel.find({
        department: department.name,
      })
      for (var i = 0; i < accountsWithDepartment.length; i++) {
       
       await accountsModel.findByIdAndUpdate(
          accountsWithDepartment[i].id,
         {department: department.department.name}
        )
      }
      for (var i = 0; i < coursesFound.length; i++) {
        const newCourse = coursesFound[i]
        newCourse.department = department.department.name
        coursesModel.findByIdAndUpdate(
          coursesFound[i].id,
          newCourse,
          function (err, result) {
            console.log(err)
            console.log(result)
          }
        )
      }
    }
    return res.json({ statusCode: 0000 })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

// update department wa2fa 3ala youssef head of department

module.exports = {
  deleteDepartment,
  createDepartment,
  updateDepartment,
}
