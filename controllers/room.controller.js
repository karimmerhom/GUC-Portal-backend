const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const roomModel = require('../../models/room.model')

const validator = require('../helpers/validations/roomValidations')
const errorCodes = require('../constants/errorCodes')
const { Op } = require('sequelize')

const {
  secretOrKey,
  smsAccessKey,
  contactAccessKey,
  emailAccessKey,
} = require('../../config/keys')

const {} = require('../constants/TBH.enum')
const {} = require('../helpers/helpers')

const createRoom = async (req, res) => {
  try {
    const room = req.body
    const isValid = validator.validateCreateRoom(room)

    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message,
      })
    }
    const roomFound = await roomModel.findOne({
      where: { roomNumber: req.body.roomNumber },
    })
    if (roomFound) {
      res.json({
        statusCode: errorCodes.roomAlreadyExists,
        error: 'Room already exists',
      })
    } else {
      roomModel.create(req.body)
      res.json({ statusCode: 0 })
    }
  } catch (e) {
    res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}
const editRoom = async (req, res) => {
  try {
    const room = req.body
    const isValid = validator.validateEditRoom(room)

    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message,
      })
    }

    const roomFound = await roomModel.findOne({
      where: { id: req.body.roomId },
    })

    let roomBody = req.body
    const roomId = roomBody.roomId
    delete roomBody.roomId
    if (roomFound) {
      await roomModel.update(roomBody, { where: { id: roomId } })
      res.json({ statusCode: errorCodes.success })
    } else {
      res.json({ statusCode: errorCodes.roomNotFound, error: 'room not found' })
    }
  } catch (e) {
    console.log(e.message)
    res.json({ code: errorCodes.unknown, error: 'Something went wrong' })
  }
}
const viewAllRooms = async (req, res) => {
  try {
    const account = req.body

    const isValid = validator.validateViewAllRooms(account)

    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message,
      })
    }
    const getRooms = await roomModel.findAll()
    return res.json({ code: errorCodes.success, rooms: getRooms })
  } catch (e) {
    return res.json({
      code: errorCodes.unknown,
      error: 'Something went wrong!',
    })
  }
}
const viewRoom = async (req, res) => {
  try {
    const room = req.body
    const isValid = validator.validateViewRoom(room)

    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message,
      })
    }
    if (req.body.hasOwnProperty('roomId')) {
      const roomFound = await roomModel.findOne({
        where: { id: req.body.roomId },
      })
      if (roomFound) {
        res.json({ statusCode: errorCodes.success, room: roomFound })
      } else {
        res.json({
          statusCode: errorCodes.roomNotFound,
          error: 'room not found',
        })
      }
    } else {
      const roomFound = await roomModel.findOne({
        where: { roomNumber: req.body.roomNumber },
      })
      if (roomFound) {
        res.json({ statusCode: errorCodes.success, room: roomFound })
      } else {
        res.json({
          statusCode: errorCodes.roomNotFound,
          error: 'room not found',
        })
      }
    }
  } catch (e) {
    res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}
const deleteRoom = async (req, res) => {
  try {
    const room = req.body
    const isValid = validator.validateViewRoom(room)

    if (isValid.error) {
      return res.json({
        code: errorCodes.validation,
        error: isValid.error.details[0].message,
      })
    }
    if (req.body.hasOwnProperty('roomId')) {
      const roomFound = await roomModel.findOne({
        where: { id: req.body.roomId },
      })
      if (roomFound) {
        await roomFound.destroy()
        res.json({ statusCode: errorCodes.success })
      } else {
        res.json({
          statusCode: errorCodes.roomNotFound,
          error: 'room not found',
        })
      }
    } else {
      const roomFound = await roomModel.findOne({
        where: { roomNumber: req.body.roomNumber },
      })
      console.log(roomFound)
      if (roomFound) {
        await roomFound.destroy()

        res.json({ statusCode: errorCodes.success })
      } else {
        res.json({
          statusCode: errorCodes.roomNotFound,
          error: 'room not found',
        })
      }
    }
  } catch (e) {
    res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}
module.exports = { createRoom, deleteRoom, editRoom, viewRoom, viewAllRooms }
