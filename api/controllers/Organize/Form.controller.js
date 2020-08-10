const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const FormModel = require('../../../models/form.model')
const validator = require('../../helpers/validations/formValidations')
const errorCodes = require('../../constants/errorCodes')

const createForm = async (req, res) => {
  try {
    const { form, Account } = req.body

    const newForm = {
      degree: form.degree,
      university: form.university,
      yearOfGraduation: form.yearOfGraduation,
      CV: form.CV,
      englishLevel: form.englishLevel,
      previousOrganzingExperience: form.previousOrganzingExperience,
      placesOrganizedAtPreviously: form.placesOrganizedAtPreviously,
      availableAudience: form.availableAudience,
      accountId: Account.id,
    }
    FormModel.create(newForm)

    return res.json({
      statusCode: '0',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      statusCode: '1',
      error: 'Something went wrong',
    })
  }
}

const editForm = async (req, res) => {
  try {
    const formID = req.body.Form.id
    const { form } = req.body
    const formid = await FormModel.findOne({
      where: {
        id: formID,
      },
    })
    if (formid) {
      delete Course.id
      CoursesModel.delete(Form, { where: { id: formID } })
    }
    return res.json({ msg: 'form is updated', statusCode: '0' })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: '1',
    })
  }
}

module.exports = {
  createForm,
  editForm,
}
