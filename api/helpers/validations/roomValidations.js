const Joi = require('joi')

const { roomType, roomSize } = require('../../constants/TBH.enum')

const validateCreateRoom = (request) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),

    roomNumber: Joi.number().valid([1, 2, 3, 4]).required(),
    roomType: Joi.string()
      .valid([roomType.MEETING, roomType.TRAINING])
      .required(),
    roomSize: Joi.string().valid([roomSize.LARGE, roomSize.SMALL]).required(),
    roomImageUrl: Joi.string(),
  }
  return Joi.validate(request, schema)
}
const validateEditRoom = (request) => {
  const schema = {
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    roomNumber: Joi.number().valid([1, 2, 3, 4]),
    roomType: Joi.string().valid([roomType.MEETING, roomType.TRAINING]),
    roomSize: Joi.string().valid([roomSize.LARGE, roomSize.SMALL]),
    roomId: Joi.number().required(),
    roomImageUrl: Joi.string(),
  }
  return Joi.validate(request, schema)
}
const validateViewRoom = (request) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    roomNumber: Joi.number().valid([1, 2, 3, 4]),
    roomId: Joi.number(),
  }).xor('roomNumber', 'roomId')
  return Joi.validate(request, schema)
}
const validateDeleteRoom = (request) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
    roomNumber: Joi.number().valid([1, 2, 3, 4]),
    roomId: Joi.number(),
  }).xor('roomNumber', 'roomId')
  return Joi.validate(request, schema)
}
const validateViewAllRooms = (request) => {
  const schema = Joi.object({
    Account: Joi.object({
      id: Joi.number().required(),
    }).required(),
  })
  return Joi.validate(request, schema)
}

module.exports = {
  validateCreateRoom,
  validateDeleteRoom,
  validateViewRoom,
  validateEditRoom,
  validateViewAllRooms,
}
