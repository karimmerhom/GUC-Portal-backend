const joi = require('joi')

const validateEditHouseholdOwner = (req, res, next) => {
  const schema = Joi.object({

    addressState: Joi.string().required()
      .when('country', {
        is: Joi.string().valid(['Australia']),
        then: Joi.string().valid([
          'New South Wales',
          'Queensland',
          'South Australia',
          'Tasmania',
          'Victoria',
          'Western Australia',
        ]),
      })
      .when('country', {
        is: Joi.string().valid(['New Zealand']),
        then: Joi.string().valid([
          'Gisborne',
          'Northland',
          'Manawatū-Whanganui',
          "Hawke's Bay",
          'West Coast',
          'Bay of Plenty',
          'Southland',
          'Waikato',
          'Tasman',
          'Marlborough',
          'Taranaki',
          'Otago',
          'Canterbury',
          'Auckland',
          'Wellington',
        ]),
      }),

    address: Joi.string(),
    implementedAmount: Joi.string(),
    leadChannel: Joi.string().valid(['Website', 'Social Media', 'Sales']),
    status: Joi.string().valid(['Customer', 'Invoiced', 'Lead']),
  })
  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode: validationFail,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}


module.exports = {
  validateEditHouseholdOwner,
}
