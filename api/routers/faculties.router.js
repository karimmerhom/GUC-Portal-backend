const express = require('express')
const router = express.Router()
const {
  createFaculty,
  deleteFaculty,
  updateFaculty,
} = require('../controllers/faculties.controller')
const {
  validateCreatefaculty,
  validateDeleteFaculty,
  validateUpdateFaculty,
} = require('../helpers/validations/facultiesValidations')

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
  '/createFaculty',
  validateCreatefaculty,
  verifyToken,
  verifyUser,
  verifyHR,
  createFaculty
)
router.post(
  '/deleteFaculty',
  validateDeleteFaculty,
  verifyToken,
  verifyUser,
  verifyHR,
  deleteFaculty
)
router.post(
  '/updateFaculty',
  validateUpdateFaculty,
  verifyToken,
  verifyUser,
  verifyHR,
  updateFaculty
)

module.exports = router
