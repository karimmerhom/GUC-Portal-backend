const joi = require('joi')

const validateBookingWithPackage = request => {
  const schema = {
    Booking: joi
      .object({
        id: joi.number().required(),
        packageCode: joi.string().required()
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

const validateAddBooking = request => {
  const schema = {
    Booking: joi
      .object({
        date: joi.date().required(),
        slot: joi
          .array()
          .items(
            joi
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
          )
          .required(),
        roomType: joi
          .string()
          .valid([
            'meeting room',
            'training room',
            'private office',
            'virtual office'
          ])
          .required(),
        roomNumber: joi
          .string()
          .valid(['1', '2', '3', '4'])
          .required(),
        amountOfPeople: joi.number().required(),
        paymentMethod: joi
          .string()
          .valid(['cash', 'credit card', 'fawry'])
          .required(),
        packageCode: joi
          .string()
          .allow('')
          .required()
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

const validateShowBookings = request => {
  const schema = {
    BookingDate: joi
      .object({
        from: joi.date().required(),
        to: joi.date().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateConfirmBooking = request => {
  const schema = {
    Booking: joi
      .object({
        id: joi.number().required(),
        packageCode: joi
          .string()
          .allow('')
          .required()
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

const validateCreatePackage = request => {
  const schema = {
    Package: joi
      .object({
        accountId: joi.number().required(),
        numberOfHours: joi
          .number()
          .positive()
          .required(),
        package: joi
          .string()
          .valid(
            'MRSG10',
            'MRSG30',
            'MRSG50',
            'TRSG10',
            'TRSG30',
            'TRSG50',
            'MRLG10',
            'MRLG30',
            'MRLG50',
            'TRLG10',
            'TRLG30',
            'TRLG50',
            'MRFRSG',
            'MRFRLG',
            'TRFRSG',
            'TRFRLG'
          )
          .required(),
        roomType: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateCancelSpecificPackage = request => {
  const schema = {
    Package: joi
      .object({
        code: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateCancelAllPackages = request => {
  const schema = {
    Package: joi
      .object({
        name: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateShowMyBooking = request => {
  const schema = {
    Account: joi
      .object({
        id: joi.number().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateViewPackageByCode = request => {
  const schema = {
    Package: joi
      .object({
        code: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateViewPackageByName = request => {
  const schema = {
    Package: joi
      .object({
        name: joi.string().required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateEditBooking = request => {
  const schema = {
    Booking: joi
      .object({
        id: joi.number().required(),
        status: joi.string().valid('confirmed', 'canceled', 'pending')
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateEditPackageByCode = request => {
  const schema = {
    Package: joi
      .object({
        code: joi.string().required(),
        status: joi
          .string()
          .valid(['canceled', 'active', 'used'])
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

const validateEditPackageByName = request => {
  const schema = {
    Package: joi
      .object({
        name: joi.string().required(),
        status: joi
          .string()
          .valid(['canceled', 'active', 'used'])
          .required()
      })
      .required()
  }
  return joi.validate(request, schema)
}

module.exports = {
  validateAddBooking,
  validateShowBookings,
  validateConfirmBooking,
  validateCreatePackage,
  validateCancelAllPackages,
  validateCancelSpecificPackage,
  validateShowMyBooking,
  validateViewPackageByCode,
  validateViewPackageByName,
  validateEditBooking,
  validateEditPackageByCode,
  validateEditPackageByName,
  validateBookingWithPackage
}
