const express = require('express')
const router = express.Router()
const {
  createSlot,
  deleteSlot,
  assignSlot,
  reAssignSlot,
  updateSlot,
  unAssignSlot,
  viewSchedule,
} = require('../controllers/slots.controller')
const {
  validateCreateSlot,
  validateDeleteSlot,
  validateAssignSlot,
  validateUpdateSlot,
  validateUnAssignSlot,
  validateViewSchedule,
} = require('../helpers/validations/slotsValidation')

const { verifyAC } = require('../helpers/authentication/ACAuthentication') // verifies that he is AC
const { verifyHR } = require('../helpers/authentication/HRAuthentication') // verifies that he is HR

const { verifyCOOR } = require('../helpers/authentication/COORAuthentication') //verifies that token is coordinator
const { verifyHOD } = require('../helpers/authentication/HODAuthentication') //verifies that token is HOD
const { verifyINST } = require('../helpers/authentication/INSTAuthentication ') // verifies that token is Instructor
const { verifyMEM } = require('../helpers/authentication/MEMAuthentication') // verifies that token is academic member

const {
  verifyToken,
} = require('../helpers/authentication/AuthenticationMiddleWare') // verifies token helper (needed before verify user)
const { verifyUser } = require('../helpers/authentication/authUser') //verifies that user in token is same as in Account:{}

router.post(
  '/createSlot',
  validateCreateSlot,
  verifyToken,
  verifyUser,
  verifyCOOR,
  createSlot
)

router.post(
  '/deleteSlot',
  validateDeleteSlot,
  verifyToken,
  verifyUser,
  verifyCOOR,
  deleteSlot
)

router.post(
  '/updateSlot',
  validateUpdateSlot,
  verifyToken,
  verifyUser,
  verifyCOOR,
  updateSlot
)

router.post(
  '/assignSlot',
  validateAssignSlot,
  verifyToken,
  verifyUser,
  verifyINST,
  assignSlot
)

router.post(
  '/reAssignSlot',
  validateAssignSlot,
  verifyToken,
  verifyUser,
  verifyINST,
  reAssignSlot
)
router.post(
  '/unAssignSlot',
  validateUnAssignSlot,
  verifyToken,
  verifyUser,
  verifyINST,
  unAssignSlot
)

router.post(
  '/viewSchedule',
  validateViewSchedule,
  verifyToken,
  verifyUser,
  viewSchedule
)

module.exports = router
