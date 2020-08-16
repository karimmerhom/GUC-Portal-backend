const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const expiryModel = require('../../models/expiry.model')

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

const setExpiryDuration = async (req, res) => {
  try {
    const duration = req.body.duration
    console.log('TOOT')
    const expiry = await expiryModel.findOne()
    console.log('TOOT2')
    if (expiry) {
      await expiryModel.update(
        { duration: req.body.duration },
        {
          where: {
            id: expiry.id,
          },
        }
      )
      res.json({ statusCode: 0 })
    } else {
      expiryModel.create({ duration: req.body.duration, on_off: 'off' })
      res.json({ statusCode: 0 })
    }
  } catch (e) {
    res.json({ statusCode: 7000, error: 'Something went wrong' })
  }
}

const turnOnExpiry = async (req, res) => {
  try {
    const expiry = await expiryModel.findOne()
    if (expiry) {
      await expiryModel.update(
        { on_off: 'on' },
        {
          where: {
            id: expiry.id,
          },
        }
      )
      res.json({ statusCode: 0 })
    } else {
      res.json({ statusCode: 7000, error: 'please set duration first' })
    }
  } catch (e) {
    console.log(e.message)
    res.json({ statusCode: 7000, error: 'Something went wrong' })
  }
}
const turnOffExpiry = async (req, res) => {
  try {
    const expiry = await expiryModel.findOne()
    if (expiry) {
      await expiryModel.update(
        { on_off: 'off' },
        {
          where: {
            id: expiry.id,
          },
        }
      )
      res.json({ statusCode: 0 })
    } else {
      res.json({ statusCode: 7000, error: 'please set duration first' })
    }
  } catch (e) {
    console.log(e.message)
    res.json({ statusCode: 7000, error: 'Something went wrong' })
  }
}

module.exports = { setExpiryDuration, turnOffExpiry, turnOnExpiry }
