//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty 
const facultyModel = require('../../models/faculty.model')

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
    createFaculty,
}