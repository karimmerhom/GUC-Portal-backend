//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty
const AccountModel = require('../../models/account.model')
const accountsModel = require('../../models/account.model')
const staffCoursesModel = require('../../models/staffCourses.model')
const coursesModel = require('../../models/courses.model')
const slotsModel = require('../../models/slots.modal')
const viewStaff = async (req, res) => {
  try {
    const account = req.body.Account
    const details = req.body
    const accountFound = await AccountModel.findOne({
        academicId: account.academicId
    })

    if (!accountFound) {
      return res.json({
        statusCode: 101,
        error: 'this account does not exist',
      })
    }
    if(details.courseId == null)
    {
    const departmentFound = accountFound.department
    const staff = await accountsModel.find
    (
        {
            department: departmentFound
        }
    )
    return res.json({
        statusCode: 0,
        staff : staff ,
        error: 'staff list in the same department',
      })
    }
    else
    {
        const courses = await staffCoursesModel.find
        (
            {
                courseId: details.courseId
            }
        )
        var staff ;
        var staffMember;
        for (var i = 0 ; i<courses.length ; i++)
        {
             staffMember = await accountsModel.find
        (
            {
                academicId: courses[i].academicId
            }
        )
        staff.push(staffMember)
        }
        return res.json({
            statusCode: 0,
            staff : staff ,
            message: 'staff list in the same department',
          })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const viewDaysOff = async (req, res) => {
    try {
      const account = req.body.Account
      const details = req.body
      const accountFound = await AccountModel.findOne({
          academicId: account.academicId
      })
  
      if (!accountFound) {
        return res.json({
          statusCode: 101,
          error: 'this account does not exist',
        })
      }
      if(details.academicId == null)
      {
      const departmentFound = accountFound.department
      var staffDaysOff
      const staff = await accountsModel.find
      (
          {
              department: departmentFound
          }
      )
      for (var i = 0 ; i<staff.length;i++)
      {
          var staffMemberDayOff = { academicId: staff[i].academicId , firstName: staff[i].firstName , lastName: staff[i].lastName ,  dayOff: staff[i].dayOff  }
          staffDaysOff.push(staffMemberDayOff)
      }
      return res.json({
          statusCode: 0,
          staff : staffDaysOff ,
          error: 'staff list with their days off',
        })
      }
      else
      {
        const staff = await accountsModel.find
        (
            {
                academicId: details.academicId
            }
        )
        const staffMemberDayOff = { academicId: staff.academicId , firstName: staff.firstName , lastName: staff.lastName ,  dayOff: staff.dayOff  }

       return res.json({
          statusCode: 0,
          staff : staffMemberDayOff ,
          error: 'staff member day off',
        })
      }
    } catch (exception) {
      console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }

  const viewCoursesCoverage = async (req, res) => {
    try {
      const account = req.body.Account
      
    
      if (!accountFound) {
        return res.json({
          statusCode: 101,
          error: 'this account does not exist',
        })
      }
     
      const departmentFound = accountFound.department
      const courses = await coursesModel.find
      (
          {
              department: departmentFound
          }
      )
      var coursesSlots;
      for(var i ; i<courses.length;i++)
      {
            const courseSlots= await slotsModel.find
            (
                {
                    courseId: courses[i].courseId
                }
            )
            coursesSlots.push(courseSlots)  
      }
      var listReturned;
      var count = 0;
      for (var i = 0 ; i<coursesSlots.length;i++ )
      {
        var innerList = coursesSlots[i]
          for(var j = 0 ; j <coursesSlots[i].length;j++)
          {
           if (innerList[j].assignedAcademicId === null)
           {
               count +=1;
           }
          }
          var obj = {couseId:innerList[j].courseId,coverage: count/coursesSlots[i].length }
          count = 0 ;
          listReturned.push(obj)
      }
      return res.json({
          statusCode: 0,
          coverage : listReturned ,
          error: 'courses coverage',
        })
      
     
    } catch (exception) {
      console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
  

module.exports = {
    viewStaff,
    viewDaysOff,
    viewCoursesCoverage
}
