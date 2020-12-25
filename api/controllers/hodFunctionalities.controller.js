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
        message: 'staff list in the same department',
      })
    }
    else
    {
      const courseFound = await coursesModel.findOne
      ({
         courseId :  details.courseId
      }
      )
      if(!courseFound)
      {
        return res.json({
          statusCode: 101,
          message: 'course does not exist',
        })
        
      }
  
        const courses = await staffCoursesModel.find
        (
            {
                courseId: details.courseId
            }
        )
      
        if(courses.length === 0)
        {
          return res.json({
            statusCode: 0,
            message: 'no staff for this course',
          })
          
        }
        var staff = [] ;
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
      var staffDaysOff = []
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
          message: 'staff list with their days off',
        })
      }
      else
      {
        const staff = await accountsModel.find
        (
            {
                academicId: details.academicId,
                department: accountFound.department
            }
        )
    
        if(staff.length === 0)
        {
            return res.json({
                statusCode: 101,
                message: 'staff member is not in your department',
              }) 
        }
        const staffMemberDayOff = { academicId: staff[0].academicId , firstName: staff[0].firstName , lastName: staff[0].lastName ,  dayOff: staff[0].dayOff  }
        
       return res.json({
          statusCode: 0,
          staff : staffMemberDayOff ,
          message: 'staff member day off',
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
      const courseId = req.body.courseId
      const accountFound = await AccountModel.findOne({
        academicId: account.academicId
    })
    
    
      if (!accountFound) {
        return res.json({
          statusCode: 101,
          error: 'this account does not exist',
        })
      }
     
      const departmentFound = accountFound.department
    var courses;
      if( courseId !== undefined)
      {
        courses = await coursesModel.find
        (
          
            {
                 courseId:courseId,
                department: departmentFound
            }
        )
        courseFound = await coursesModel.findOne
        (
          
            {
                 courseId:courseId,
                department: departmentFound
            }
        )
      if(!courseFound)
      {
        return res.json({
          statusCode: 101,
          error: 'this course either does not exist or is not in your depatment',
        })
      }
    
        }
        else{
         
         courses = await coursesModel.find
          (
              {
                  
                  department: departmentFound
              }
          )
        }
     
      var coursesSlots=[];
      for(var i = 0  ; i<courses.length;i++)
      {
       
            const courseSlots= await slotsModel.find
            (
                {
                    courseId: courses[i].courseId
                }
            )
            coursesSlots.push(courseSlots)  
      }
   
      var listReturned= [];
      var count = 0;
      var innerList
      for (var i = 0 ; i<coursesSlots.length;i++ )
      {
        innerList = coursesSlots[i]
     
          for(var j = 0 ; j <coursesSlots[i].length;j++)
          {
           if (innerList[j].assignedAcademicId)
           {
               count +=1;
           }
          }
         
          var obj = {couseId: courses[i].courseId,coverage: coursesSlots[i].length===0?100:count/coursesSlots[i].length*100 }
          count = 0 ;
          listReturned.push(obj)
      }
      if(courseId){
        return res.json({
            statusCode: 0,
            coverage : listReturned[0] ,
            message: 'courses coverage',
          })
      }
      return res.json({
          statusCode: 0,
          coverage : listReturned ,
          message: 'courses coverage',
        })
      
     
    } catch (exception) {
      console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }

  const viewTeachingAssignments = async (req, res) => {
    try {
      const account = req.body.Account
      const accountFound = await AccountModel.findOne({
        academicId: account.academicId
    })

    
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

      var coursesSlots=[];
      for(var i = 0  ; i<courses.length;i++)
      {
       
            const courseSlots= await slotsModel.find
            (
                {
                    courseId: courses[i].courseId
                }
            )
            var obj = {courseId : courses[i].courseId , List:courseSlots }
            coursesSlots.push(obj)  
      }
   
     
     
      return res.json({
          statusCode: 0,
          list: coursesSlots ,
          message: 'course slots',
        })
      
     
    } catch (exception) {
      console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
  

module.exports = {
    viewStaff,
    viewDaysOff,
    viewCoursesCoverage,
    viewTeachingAssignments
}
