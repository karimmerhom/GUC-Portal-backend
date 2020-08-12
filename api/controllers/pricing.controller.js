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
      res.json({ statusCode: 7000, error: 'Pricing already exists' })
    } else {
      pricingModel.create(req.body)
      res.json({ statusCode: 0 })
    }
  } catch (e) {
    res.json({ statusCode: 7000, error: 'Something went wrong' })
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
      res.json({ statusCode: 0 })
    } else {
      res.json({ statusCode: 7000, error: 'room not found' })
    }
  } catch (e) {
    console.log(e.message)
    res.json({ statusCode: 7000, error: 'Something went wrong' })
  }
}

const viewPricings = async (req, res) => {
  try {
    const prices = await pricingModel.findAll()
    res.json({ statusCode: 0, prices })
  } catch (e) {
    res.json({ statusCode: 7000, error: 'Something went wrong' })
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
      res.json({ statusCode: 0 })
    } else {
      res.json({ statusCode: 7000, error: 'room not found' })
    }
  } catch (e) {
    res.json({ statusCode: 7000, error: 'Something went wrong' })
  }
}
module.exports = { editPricing, deletePricing, createPricing, viewPricings }
