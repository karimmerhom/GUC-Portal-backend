const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const pendingModel = require('../../models/pending.model')

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

const setpendingBookings = async (req, res) => {
  try {
    const value = req.body.value
    const pending = await pendingModel.findOne({
      where: { pendingType: 'Bookings' },
    })
    if (pending) {
      await pendingModel.update(
        { value: req.body.value },
        {
          where: {
            id: pending.id,
          },
        }
      )
      res.json({ statusCode: 0 })
    } else {
      pendingModel.create({ value: req.body.value, pendingType: 'Bookings' })
      res.json({ statusCode: 0 })
    }
  } catch (e) {
    res.json({ statusCode: 7000, error: 'Something went wrong' })
  }
}

const setpendingPackages = async (req, res) => {
  try {
    const value = req.body.value
    const pending = await pendingModel.findOne({
      where: { pendingType: 'Packages' },
    })
    if (pending) {
      await pendingModel.update(
        { value: req.body.value },
        {
          where: {
            id: pending.id,
          },
        }
      )
      res.json({ statusCode: 0 })
    } else {
      pendingModel.create({ value: req.body.value, pendingType: 'Packages' })
      res.json({ statusCode: 0 })
    }
  } catch (e) {
    res.json({ statusCode: 7000, error: 'Something went wrong' })
  }
}

module.exports = { setpendingBookings, setpendingPackages }
