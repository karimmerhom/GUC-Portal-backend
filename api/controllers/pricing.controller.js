const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const pricingModel = require('../../models/pricing.model')

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

const createPricing = async (req, res) => {
  try {
    const room = req.body
    const roomFound = await pricingModel.findOne({
      where: { roomType: req.body.roomType, pricingType: req.body.pricingType },
    })
    if (roomFound) {
      res.json({
        statusCode: errorCodes.pricingAlreadyExists,
        error: 'Pricing already exists',
      })
    } else {
      pricingModel.create(req.body)
      res.json({ statusCode: errorCodes.success })
    }
  } catch (e) {
    res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const editPricing = async (req, res) => {
  try {
    const roomFound = await pricingModel.findOne({
      where: { roomType: req.body.roomType, pricingType: req.body.pricingType },
    })

    let roomBody = req.body

    if (roomFound) {
      await pricingModel.update(roomBody, {
        where: {
          roomType: req.body.roomType,
          pricingType: req.body.pricingType,
        },
      })
      res.json({ statusCode: errorCodes.success })
    } else {
      res.json({ statusCode: errorCodes.roomNotFound, error: 'room not found' })
    }
  } catch (e) {
    console.log(e.message)
    res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const viewPricings = async (req, res) => {
  try {
    const prices = await pricingModel.findAll()
    res.json({ statusCode: errorCodes.success, prices })
  } catch (e) {
    res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}

const deletePricing = async (req, res) => {
  try {
    const room = req.body

    const roomFound = await pricingModel.findOne({
      where: { roomType: req.body.roomType, pricingType: req.body.pricingType },
    })

    if (roomFound) {
      await roomFound.destroy()
      res.json({ statusCode: errorCodes.success })
    } else {
      res.json({ statusCode: errorCodes.roomNotFound, error: 'room not found' })
    }
  } catch (e) {
    res.json({ statusCode: errorCodes.unknown, error: 'Something went wrong' })
  }
}
module.exports = { editPricing, deletePricing, createPricing, viewPricings }
