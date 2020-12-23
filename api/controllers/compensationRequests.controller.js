const leavesModel = require('../../models/leaves.model')
const moment = require('moment')
const createComprequest = async (req, res) => {
    try {
      const leaves = req.body
      const leaveFound = await leavesModel.findOne({
       academicId: leaves.academicId,
        date: leaves.date
      })
  
      if (leaveFound) {
        return res.json({
          statusCode: 101,
          error: 'leave already requested',
        })
      }
      console.log(parseInt(leaves.date.substr(0,4)))
      if(leaves.type=='annual'){
        const month = leaves.date.substr(5,2)
        const day = leaves.date.substr(8,2)
        const year = leaves.date.substr(0,4)
        const d = moment(`${year}-${month}-${day}T00:00:00.0000`)
        console.log(day+' '+month+' '+year)
        const today = moment()
                console.log(today)

              if(today.isAfter(d)){
                console.log("saas")
                return res.json({
                  statusCode: 101,
                  error: 'the annual leave must be submitted before the requested day',
                })
              }
        }
      
     await leavesModel.create(leaves, function (err, result) {
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
    requestLeave,
    
   

}