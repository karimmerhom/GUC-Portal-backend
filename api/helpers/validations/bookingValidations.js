const Joi = require('joi')
const statusCodes = require('../../constants/errorCodes')

const { roomType, roomSize } = require('../../constants/TBH.enum')

const validateViewCalendar = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    startDate: Joi.string().required(),
    filterRoomType: Joi.string().valid([
      roomType.MEETING,
      roomType.TRAINING,
      '',
    ]),
    filterRoomSize: Joi.string().valid([roomSize.LARGE, roomSize.SMALL, '']),
  }

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: statusCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateCancelBooking = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    bookingId: Joi.number().required(),
  }

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: statusCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateViewDateBookings = (req, res, next) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    date: Joi.string().required(),
  }

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: statusCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateViewMyBooking = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: statusCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}

const validateBookRoom = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    date: Joi.date().required(),
    paymentMethod: Joi.string().required(),
    slots: Joi.array().required(),
    roomNumber: Joi.number().required(),
    roomType: Joi.string().required(),
    roomLayout: Joi.string().required(),
    roomSize: Joi.string().required(),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: statusCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}
const validateEditMyBooking = (req, res, next) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    date: Joi.date().required(),
    paymentMethod: Joi.string().required(),
    slots: Joi.array().required(),
    roomNumber: Joi.number().required(),
    roomType: Joi.string().required(),
    roomLayout: Joi.string().required(),
    roomSize: Joi.string().required(),
    bookingId: Joi.string().required(),
  })
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: statusCodes.validation,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}
module.exports = {
  validateViewMyBooking,
  validateCancelBooking,
  validateViewCalendar,
  validateViewDateBookings,
  validateEditMyBooking,
  validateBookRoom,
}
