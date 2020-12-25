//const updateDepartment = async (req, res) => lama ussef ye5alas beoble
// creating courses , departments tables 3shan homa gwa faculty
const AccountModel = require('../../models/account.model')
const accountsModel = require('../../models/account.model')
const staffCoursesModel = require('../../models/staffCourses.model')
const coursesModel = require('../../models/courses.model')
const slotsModel = require('../../models/slots.modal')


  const viewMyCoursesCoverage = async (req, res) => {
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
    var courses = [];
    const assignedCourses =   await staffCoursesModel.find
    (
        {
            academicId: accountFound.academicId
           
        }
    )
      
          for(var i = 0 ; i<assignedCourses.length;i++ )
          {
             const x = await coursesModel.find
               (
                 
                   {
                       courseId: assignedCourses[i].courseId,
                       department: departmentFound
                   }
               )
               courses.push(x[0])
                 }
        
     if(courses.length === 0)
     {
      return res.json({
        statusCode: 0,
        message: "no assigned courses",
      })
  
     }
      var coursesSlots=[];
      for(var i = 0  ; i<courses.length;i++)
      {
       
            const courseSlots= await slotsModel.find
            (
                {
                    courseId: courses[i].courseId,
                   
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

  const viewMyCoursesAssignment = async (req, res) => {
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
    var courses = [];
    const assignedCourses =   await staffCoursesModel.find
    (
        {
            academicId: accountFound.academicId
           
        }
    )
      
          for(var i = 0 ; i<assignedCourses.length;i++ )
          {
             const x = await coursesModel.find
               (
                 
                   {
                       courseId: assignedCourses[i].courseId,
                       department: departmentFound
                   }
               )
               courses.push(x[0])
                 }
        console.log(assignedCourses )
     if(courses.length === 0)
     {
      return res.json({
        statusCode: 0,
        message: "no assigned courses",
      })
  
     }
      var coursesSlots=[];
      for(var i = 0  ; i<courses.length;i++)
      {
       
            const courseSlots= await slotsModel.find
            (
                {
                    courseId: courses[i].courseId,
                   
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
         
          var obj = {couseId: courses[i].courseId,list: coursesSlots[i]}
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
          list : listReturned ,
          message: 'courses coverage',
        })
      
     
    } catch (exception) {
      console.log(exception)
      return res.json({ statusCode: 400, error: 'Something went wrong' })
    }
  }
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
  

module.exports = {
  viewMyCoursesCoverage,
  viewMyCoursesAssignment,
  viewStaff
}
