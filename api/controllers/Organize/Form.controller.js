const bcrypt = require('bcryptjs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const FormModel = require('../../../models/form.model')
const validator = require('../../helpers/validations/formValidations')
const errorCodes = require('../../constants/errorCodes')

const createForm = async (req, res) => {
  try {
    const { form, Account } = req.body
    const formFound = await FormModel.findOne({
      where: { accountId: Account.id },
    })

    if (formFound) {
      return res.json({
        statusCode: errorCodes.formExists,
        error: 'you already have a form',
      })
    }
    let year = `${new Date(form.yearOfGraduation).getFullYear()}` + ''

    const newForm = {
      degree: form.degree,
      university: form.university,
      yearOfGraduation: year,
      CV: form.CV,
      englishLevel: form.englishLevel,
      previousOrganizingExperience: form.previousOrganizingExperience,
      placesOrganizedAtPreviously: form.placesOrganizedAtPreviously,
      availableAudience: form.availableAudience,
      accountId: Account.id,
    }
    FormModel.create(newForm)

    return res.json({
      statusCode: errorCodes.success,
    })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

const editForm = async (req, res) => {
  try {
    const formID = req.body.form.id
    const { form } = req.body
    const formid = await FormModel.findOne({
      where: {
        id: formID,
      },
    })
    if (!formid) {
      return res.json({
        msg: 'form doesnt exist',
        statusCode: errorCodes.formNotFound,
      })
    }
    delete form.id
    FormModel.update(form, { where: { id: formID } })
    return res.json({ msg: 'form is updated', statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      error: 'Something went wrong',
      statusCode: errorCodes.unknown,
    })
  }
}

const viewForm = async (req, res) => {
  try {
    const formId = req.body.Form.id

    const checkForm = await FormModel.findOne({
      where: {
        id: formId,
      },
    })
    if (!checkForm) {
      return res.json({
        error: 'Form does not exist',
        statusCode: '7',
      })
    }
    return res.json({ Form: checkForm, statusCode: '0' })
  } catch (exception) {
    console.log(exception)
    return res.json({ error: 'Something went wrong' })
  }
}
module.exports = {
  createForm,
  editForm,
  viewForm
}
