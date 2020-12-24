const locationsModel = require('../../models/locations.model')
const AccountModel = require('../../models/account.model')
const errorCodes = require('../constants/errorCodes')
const slotsModel = require('../../models/slots.modal')
const slotLinkingModel = require('../../models/slotLinking.model')
const staffCoursesModel = require('../../models/staffCourses.model')

const slotLinkingRequest = async (req, res) => {
  try {
    const Account = req.body.Account
    const slot = req.body.slot
    const acc = await AccountModel.findOne({ academicId: Account.academicId })
    if (!acc) {
      return res.json({
        statusCode: errorCodes.accountDoesNotExist,
        error: 'account does not exists',
      })
    }

    const slotfound = await slotsModel.findOne({
      id: slot.id,
    })

    if (!slotfound) {
      return res.json({
        statusCode: errorCodes.slotNotFound,
        error: 'slot does not exists',
      })
    }

    if (slotfound.academicId) {
      return res.json({
        statusCode: errorCodes.slotAssigned,
        error: 'slot already assigned',
      })
    }

    const link = slotLinkingModel.create({
      slotId: slotfound.id,
      academicId: Account.academicId,
    })

    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const acceptSlotLinkingRequest = async (req, res) => {
  try {
    const Account = req.body.Account
    const slotLinkId = req.body.slotLinkId

    const link = await slotLinkingModel.findById(slotLinkId)

    if (!link) {
      return res.json({
        statusCode: errorCodes.slotNotFound,
        error: 'slot link not found',
      })
    }
    if (link.accepted === true) {
      return res.json({
        statusCode: errorCodes.linkAccepted,
        error: 'slot link already accepted',
      })
    }

    const slot = await slotsModel.findOne({
      id: link.slotId,
    })

    if (!slot) {
      return res.json({
        statusCode: errorCodes.slotNotFound,
        error: 'slot does not exists',
      })
    }

    if (slot.academicId) {
      return res.json({
        statusCode: errorCodes.slotAssigned,
        error: 'slot already assigned',
      })
    }

    const staffCourse = await staffCoursesModel.findOne({
      courseId: slot.courseId,
      academicId: Account.academicId,
    })

    if (!staffCourse) {
      return res.json({
        statusCode: errorCodes.notYourCourse,
        error: 'This is not your course ya coordinator',
      })
    }

    link.accepted = true

    const updated = await slotLinkingModel.findByIdAndUpdate(link.id, link)
    slot.academicId = link.academicId
    const updatedSlot = await slotsModel.findByIdAndUpdate(slot.id, slot)
    return res.json({ statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

const viewSlotLinkingRequest = async (req, res) => {
  try {
    const Account = req.body.Account

    const links = await slotLinkingModel.find()

    let mylinks = []

    for (var i = 0; i < links.length; i++) {
      var link = links[0]

      var slot = await slotsModel.findById(link.slotId)

      var staffCourse = await staffCoursesModel.find({
        academicId: Account.academicId,
        courseId: slot.courseId,
      })

      if (staffCourse) {
        mylinks.push(link)
      }
    }

    return res.json({ mylinks, statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({ statusCode: 400, error: 'Something went wrong' })
  }
}

module.exports = {
  acceptSlotLinkingRequest,
  slotLinkingRequest,
  viewSlotLinkingRequest,
}
