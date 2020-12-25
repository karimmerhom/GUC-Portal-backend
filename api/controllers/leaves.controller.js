const leavesModel = require('../../models/leaves.model')
const moment = require('moment')
const { leaveTypes, leaveStatus } = require('../constants/GUC.enum')
const accountsModel = require('../../models/account.model')
const slotsModel = require('../../models/slots.modal')
const replacementsRequestsModel = require('../../models/replacementsRequests.model')
const errorCodes = require('../constants/errorCodes')

const requestMaternityLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveDay = req.body.leaveDay
    const comments = req.body.comments

    var day = leaveDay.day
    var month = leaveDay.month
    var year = leaveDay.year
    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`

    const d = `${year}-${month}-${day}T00:00:00.0000`
    const dM = moment(`${year}-${month}-${day}T00:00:00.0000`)

    const account = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'account not found',
      })
    }

    if (account.dayOff === dM.format('dddd').toLowerCase()) {
      return res.json({
        statusCode: errorCodes.yourDayOff,
        error: 'this is already your day off',
      })
    }

    if (account.gender !== 'female') {
      return res.json({
        statusCode: errorCodes.notFemale,
        error: 'Male employees cannot request maternity leaves',
      })
    }

    const leaveFound = await leavesModel.findOne({
      academicId: Account.academicId,
      date: d,
    })

    if (leaveFound) {
      return res.json({
        statusCode: 101,
        error: 'leave already requested',
      })
    }

    await leavesModel.create({
      comments: comments,
      status: leaveStatus.PENDING,
      academicId: Account.academicId,
      date: d,
      type: leaveTypes.MATERNITY,
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const requestSickLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveDay = req.body.leaveDay
    const comments = req.body.comments

    var day = leaveDay.day
    var month = leaveDay.month
    var year = leaveDay.year
    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`

    const d = `${year}-${month}-${day}T00:00:00.0000`
    const dM = moment(`${year}-${month}-${day}T00:00:00.0000`)

    const today = moment().add(-3, 'day')
    if (today.isAfter(dM)) {
      return res.json({
        statusCode: errorCodes.dateAfterAllowed,
        error: 'You cannot request after 3 days',
      })
    }

    const account = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'account not found',
      })
    }

    if (account.dayOff === dM.format('dddd').toLowerCase()) {
      return res.json({
        statusCode: errorCodes.yourDayOff,
        error: 'this is already your day off',
      })
    }

    const leaveFound = await leavesModel.findOne({
      academicId: Account.academicId,
      date: d,
    })

    if (leaveFound) {
      return res.json({
        statusCode: 101,
        error: 'leave already requested',
      })
    }

    await leavesModel.create({
      academicId: Account.academicId,
      date: d,
      type: leaveTypes.SICK,
      comments: comments,
      status: leaveStatus.PENDING,
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const requestAccidentalLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveDay = req.body.leaveDay
    const comments = req.body.comments

    var day = leaveDay.day
    var month = leaveDay.month
    var year = leaveDay.year
    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`

    const d = `${year}-${month}-${day}T00:00:00.0000`
    const dM = moment(`${year}-${month}-${day}T00:00:00.0000`)
    const today = moment()
    if (dM.isAfter(today)) {
      return res.json({
        statusCode: errorCodes.dateAfterAllowed,
        error: 'You cannot request accidental leave before it happens',
      })
    }

    const account = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'account not found',
      })
    }

    if (account.dayOff === dM.format('dddd').toLowerCase()) {
      return res.json({
        statusCode: errorCodes.yourDayOff,
        error: 'this is already your day off',
      })
    }

    const leaveFound = await leavesModel.findOne({
      academicId: Account.academicId,
      date: d,
    })
    //check if person actually came!
    if (leaveFound) {
      return res.json({
        statusCode: 101,
        error: 'leave already requested',
      })
    }

    await leavesModel.create({
      status: leaveStatus.PENDING,
      academicId: Account.academicId,
      date: d,
      type: leaveTypes.ACCIDENTAL,
      comments: comments,
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const requestCompensationLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveDay = req.body.leaveDay
    const reasonForCompensation = req.body.reasonForCompensation
    var day = leaveDay.day
    var month = leaveDay.month
    var year = leaveDay.year
    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`

    const d = `${year}-${month}-${day}T00:00:00.0000`
    const dM = moment(`${year}-${month}-${day}T00:00:00.0000`)
    const today = moment()
    if (dM.isAfter(today)) {
      return res.json({
        statusCode: errorCodes.dateAfterAllowed,
        error: 'You cannot request compensation leave before it happens',
      })
    }

    const account = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'account not found',
      })
    }

    if (account.dayOff === dM.format('dddd').toLowerCase()) {
      return res.json({
        statusCode: errorCodes.yourDayOff,
        error: 'this is already your day off',
      })
    }

    const leaveFound = await leavesModel.findOne({
      academicId: Account.academicId,
      date: d,
    })
    //check if person actually came!
    if (leaveFound) {
      return res.json({
        statusCode: 101,
        error: 'leave already requested',
      })
    }

    if (!noSignOutInThisDay(d, Account.academicId)) {
      return res.json({
        statusCode: errorCodes.signOutExists,
        error: 'you signed out on that day',
      })
    }

    await leavesModel.create({
      status: leaveStatus.PENDING,
      academicId: Account.academicId,
      date: d,
      type: leaveTypes.COMPENSATION,
      reasonForCompensation: reasonForCompensation,
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
const requestAnnualLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveDay = req.body.leaveDay

    var day = leaveDay.day
    var month = leaveDay.month
    var year = leaveDay.year
    day = `${parseInt(day) < 10 ? '0' + parseInt(day) : parseInt(day)}`
    month = `${parseInt(month) < 10 ? '0' + parseInt(month) : parseInt(month)}`

    const d = `${year}-${month}-${day}T00:00:00.0000`
    const dM = moment(`${year}-${month}-${day}T00:00:00.0000`)

    const today = moment()
    if (today.isAfter(dM)) {
      return res.json({
        statusCode: errorCodes.dateAfterAllowed,
        error: 'You cannot request annual leave in day before today',
      })
    }

    const account = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'account not found',
      })
    }

    if (account.dayOff === dM.format('dddd').toLowerCase()) {
      return res.json({
        statusCode: errorCodes.yourDayOff,
        error: 'this is already your day off',
      })
    }

    const leaveFound = await leavesModel.findOne({
      academicId: Account.academicId,
      date: d,
    })

    if (leaveFound) {
      return res.json({
        statusCode: 101,
        error: 'leave already requested',
      })
    }

    const slots = await slotsModel.find({
      assignedAcademicId: Account.academicId,
      day: dM.format('dddd').toLowerCase(),
    })

    console.log(slots)
    var allSlotsRequested = true
    var outputList = []
    for (var i = 0; i < slots.length; i++) {
      var theSlot = slots[i]

      const repReq = await replacementsRequestsModel.findOne({
        date: d,
        academicId: Account.academicId,
        slotId: theSlot.id,
      })

      if (repReq) {
        outputList.push(repReq.id)
        if (repReq.status !== leaveStatus.ACCEPTED) {
          allSlotsRequested = false
        }
      } else {
        allSlotsRequested = false
      }
    }

    await leavesModel.create({
      status: leaveStatus.PENDING,
      academicId: Account.academicId,
      date: d,
      type: leaveTypes.ANNUAL,
      repReqIds: outputList,
      allRepReqAccepted: allSlotsRequested,
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const acceptAnnualLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveId = req.body.leaveId

    const HOD = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!HOD) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'instructor account not found',
      })
    }

    const leaveFound = await leavesModel.findById(leaveId)

    if (!leaveFound) {
      return res.json({
        statusCode: errorCodes.leaveNotFound,
        error: 'leave not found',
      })
    }
    if (!(leaveFound.type === leaveTypes.ANNUAL)) {
      return res.json({
        statusCode: errorCodes.notRightLeaveType,
        error: 'leave not the right type',
      })
    }

    const account = await accountsModel.findOne({
      academicId: leaveFound.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'member account not found',
      })
    }

    if (account.department !== HOD.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'Not your department ya HOD',
      })
    }

    if (account.annualLeavesBalance < 1) {
      return res.json({
        statusCode: errorCodes.notEnoughAnnualLeaves,
        error: 'not Enough Annual Leaves',
      })
    }
    if (leaveFound.status === leaveStatus.ACCEPTED) {
      return res.json({
        statusCode: errorCodes.alreadyAccepted,
        error: 'H.O.D already accepted this request',
      })
    }
    const repReq = await replacementsRequestsModel.find({
      date: leaveFound.date,
      academicId: Account.academicId,
    })

    for (var i = 0; i < repReq.length; i++) {
      var theR = repReq[i]

      if (theR.status === leaveStatus.ACCEPTED) {
        theR.hodStatus = leaveStatus.ACCEPTED
        const repReq = await replacementsRequestsModel.findByIdAndUpdate(
          theR.id,
          theR
        )
      }
    }
    addOneDay(leaveFound.date, account.academicId)

    leaveFound.status = leaveStatus.ACCEPTED
    account.annualLeavesBalance = account.annualLeavesBalance - 1
    await accountsModel.findByIdAndUpdate(account.id, account)
    await leavesModel.findByIdAndUpdate(leaveFound.id, leaveFound)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const acceptAccidentalLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveId = req.body.leaveId

    const HOD = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!HOD) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'instructor account not found',
      })
    }

    const leaveFound = await leavesModel.findById(leaveId)

    if (!leaveFound) {
      return res.json({
        statusCode: errorCodes.leaveNotFound,
        error: 'leave not found requested',
      })
    }
    if (!(leaveFound.type === leaveTypes.ACCIDENTAL)) {
      return res.json({
        statusCode: errorCodes.notRightLeaveType,
        error: 'leave not the right type',
      })
    }

    if (leaveFound.status === leaveStatus.ACCEPTED) {
      return res.json({
        statusCode: errorCodes.alreadyAccepted,
        error: 'H.O.D already accepted this request',
      })
    }

    const account = await accountsModel.findOne({
      academicId: leaveFound.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'member account not found',
      })
    }

    if (account.department !== HOD.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'Not your department ya HOD',
      })
    }

    if (account.annualLeavesBalance < 1) {
      return res.json({
        statusCode: errorCodes.notEnoughAnnualLeaves,
        error: 'not Enough Annual Leaves',
      })
    }
    if (!noSignOutInThisDay(leaveFound.date, account.academicId)) {
      return res.json({
        statusCode: errorCodes.signOutExists,
        error: 'you signed out on that day',
      })
    }
    addOneDay(leaveFound.date, account.academicId)

    account.annualLeavesBalance = account.annualLeavesBalance - 1
    await accountsModel.findByIdAndUpdate(account.id, account)
    await leavesModel.findByIdAndUpdate(leaveFound.id, leaveFound)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const acceptSickLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveId = req.body.leaveId

    const HOD = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!HOD) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'instructor account not found',
      })
    }

    const leaveFound = await leavesModel.findById(leaveId)

    if (!leaveFound) {
      return res.json({
        statusCode: errorCodes.leaveNotFound,
        error: 'leave not found requested',
      })
    }
    if (!(leaveFound.type === leaveTypes.SICK)) {
      return res.json({
        statusCode: errorCodes.notRightLeaveType,
        error: 'leave not the right type',
      })
    }

    if (leaveFound.status === leaveStatus.ACCEPTED) {
      return res.json({
        statusCode: errorCodes.alreadyAccepted,
        error: 'H.O.D already accepted this request',
      })
    }

    const account = await accountsModel.findOne({
      academicId: leaveFound.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'member account not found',
      })
    }

    if (account.department !== HOD.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'Not your department ya HOD',
      })
    }
    addOneDay(leaveFound.date, account.academicId)

    leaveFound.status = leaveStatus.ACCEPTED
    await leavesModel.findByIdAndUpdate(leaveFound.id, leaveFound)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const acceptMaternityLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveId = req.body.leaveId

    const HOD = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!HOD) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'instructor account not found',
      })
    }
    const leaveFound = await leavesModel.findById(leaveId)

    if (!leaveFound) {
      return res.json({
        statusCode: errorCodes.leaveNotFound,
        error: 'leave not found requested',
      })
    }
    if (!(leaveFound.type === leaveTypes.MATERNITY)) {
      return res.json({
        statusCode: errorCodes.notRightLeaveType,
        error: 'leave not the right type',
      })
    }
    if (leaveFound.status === leaveStatus.ACCEPTED) {
      return res.json({
        statusCode: errorCodes.alreadyAccepted,
        error: 'H.O.D already accepted this request',
      })
    }
    const account = await accountsModel.findOne({
      academicId: leaveFound.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'member account not found',
      })
    }

    if (account.department !== HOD.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'Not your department ya HOD',
      })
    }
    addOneDay(leaveFound.date, account.academicId)
    leaveFound.status = leaveStatus.ACCEPTED
    await leavesModel.findByIdAndUpdate(leaveFound.id, leaveFound)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const rejectLeave = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveId = req.body.leaveId

    const HOD = await accountsModel.findOne({
      academicId: Account.academicId,
    })

    if (!HOD) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'instructor account not found',
      })
    }
    const leaveFound = await leavesModel.findById(leaveId)

    if (!leaveFound) {
      return res.json({
        statusCode: errorCodes.leaveNotFound,
        error: 'leave not found requested',
      })
    }
    if (leaveFound.status === leaveStatus.ACCEPTED) {
      return res.json({
        statusCode: errorCodes.leaveAccepted,
        error: 'Cannot reject after accept',
      })
    }

    const account = await accountsModel.findOne({
      academicId: leaveFound.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'member account not found',
      })
    }

    if (account.department !== HOD.department) {
      return res.json({
        statusCode: errorCodes.notYourDepartment,
        error: 'Not your department ya HOD',
      })
    }

    leaveFound.status = leaveStatus.REJECTED
    await leavesModel.findByIdAndUpdate(leaveFound.id, leaveFound)

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const cancelLeaveReq = async (req, res) => {
  try {
    const Account = req.body.Account
    const leaveId = req.body.leaveId
    const account = await accountsModel.findOne({
      academicId: leaveFound.academicId,
    })

    if (!account) {
      return res.json({
        statusCode: errorCodes.accountNotFound,
        error: 'member account not found',
      })
    }

    const leaveFound = await leavesModel.findById(leaveId)

    if (!leaveFound) {
      return res.json({
        statusCode: errorCodes.leaveNotFound,
        error: 'leave not found requested',
      })
    }

    if (leaveFound.status === leaveStatus.ACCEPTED) {
      const date = moment(leaveFound.date)
      const today = moment()
      if (today.isAfter(date)) {
        return res.json({
          statusCode: errorCodes.dateInThePast,
          error: 'date already passed',
        })
      }
      removeOneDay(leaveFound.date, Account.academicId)
      account.annualLeavesBalance = account.annualLeavesBalance + 1
      await accountsModel.findByIdAndUpdate(account.id, account)
      await leavesModel.findByIdAndDelete(leaveFound.id)
      return res.json({ statusCode: errorCodes.success })
    } else {
      await leavesModel.findByIdAndDelete(leaveFound.id)
      return res.json({ statusCode: errorCodes.success })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
const viewLeaves = async (req, res) => {
  try {
    const Account = req.body.Account
    const status = req.body.status

    let leaveFound = []
    if (status) {
      leaveFound = await leavesModel.find({
        academicId: Account.academicId,
        status: status,
      })
    } else {
      leaveFound = await leavesModel.find({
        academicId: Account.academicId,
      })
    }

    return res.json({ statusCode: errorCodes.success, leaves: leaveFound })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}
const addOneDay = async (date, academicId) => {
  const month = moment(date).month() + 1
  const year = moment(date).year()

  const workAttendanceFound = await workAttendanceModel.findOne({
    academicId: academicId,
    month: month,
    year: year,
  })
  console.log(workAttendanceFound)
  if (!workAttendanceFound) {
    return false
  } else {
    console.log('???')
    await workAttendanceModel.updateOne({
      academicId: academicId,
      month: month,
      year: year,
      totalWorkedDays: workAttendanceFound.totalWorkedDays + 1,
      totalWorkedHours: workAttendanceFound.totalWorkedHours + 8.4,
    })
    console.log('????')

    return true
  }
}
const removeOneDay = async (date, academicId) => {
  const month = moment(date).month() + 1
  const year = moment(date).year()

  const workAttendanceFound = await workAttendanceModel.findOne({
    academicId: academicId,
    month: month,
    year: year,
  })
  console.log(workAttendanceFound)
  if (!workAttendanceFound) {
    return false
  } else {
    console.log('???')
    await workAttendanceModel.updateOne({
      academicId: academicId,
      month: month,
      year: year,
      totalWorkedDays: workAttendanceFound.totalWorkedDays - 1,
      totalWorkedHours: workAttendanceFound.totalWorkedHours - 8.4,
    })
    console.log('????')

    return true
  }
}

const noSignOutInThisDay = async (date, academicId) => {
  const attendanceFound = await attendanceModel.find({ academicId: academicId })
  if (attendanceFound.length === 0) return false
  for (let i = 0; i < attendanceFound.length; i++) {
    let attendance = attendanceFound[i]

    if (
      moment(date).date() === moment(attendance.signInTime).date() &&
      moment(date).month() === moment(attendance.signInTime).month() &&
      moment(date).year() === moment(attendance.signInTime).year()
    ) {
      return false
    }
  }

  return true
}

module.exports = {
  rejectLeave,
  requestCompensationLeave,
  requestAnnualLeave,
  requestMaternityLeave,
  requestSickLeave,
  requestAccidentalLeave,
  acceptAccidentalLeave,
  acceptAnnualLeave,
  acceptMaternityLeave,
  acceptSickLeave,
  viewLeaves,
  cancelLeaveReq,
}
