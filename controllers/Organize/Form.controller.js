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
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: errorCodes.unknown,
    })
  }
}

const viewForm = async (req, res) => {
  try {
    const accountId = req.body.accountId
    const type = req.data.type
    const { Account } = req.body

    const checkForm = await FormModel.findOne({
      where: {
        accountId,
      },
    })
    if (!checkForm) {
      return res.json({
        error: 'Form does not exist',
        statusCode: errorCodes.formNotFound,
      })
    }
    if (type !== 'admin' && accountId !== Account.id) {
      return res.json({
        error: 'Unauthorized',
        statusCode: errorCodes.unauthorized,
      })
    }

    return res.json({ Form: checkForm, statusCode: errorCodes.success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: errorCodes.unknown,
    })
  }
}
const viewAllFormsAdmin = async (req, res) => {
  try {
    const result = await FormModel.findAll()

    return res.json({ AllForms: result, statusCode: errorCodes.success })
  } catch (exception) {
    return res.json({
      error: 'no courses found',
      statusCode: errorCodes.unknown,
    })
  }
}
module.exports = {
  createForm,
  editForm,
  viewForm,
  viewAllFormsAdmin,
}
