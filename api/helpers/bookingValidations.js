const joi = require('joi')

const validateAddBooking = request => {
  const schema = {
    Booking: joi
      .object({
        date: joi.date().required(),
        slot: joi
          .string()
          .valid([
            '9AM',
            '10AM',
            '11AM',
            '12PM',
            '1PM',
            '2PM',
            '3PM',
            '4PM',
            '5PM',
            '6PM',
            '7PM',
            '8PM',
            '9PM'
          ])
          .required(),
        period: joi.string().required(),
        roomType: joi
          .string()
          .valid([
            'meeting room',
            'training room',
            'private office',
            'virtual office'
          ])
          .required(),
        amountOfPeople: joi.number().required(),
        price: joi.number().required(),
        packageCode: joi.string(),
        paymentMethod: joi.string().valid(['cash', 'credit card', 'fawry'])
      })
      .required(),
    Account: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateAddBooking
}
