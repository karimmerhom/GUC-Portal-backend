const bcrypt = require('bcryptjs')
const axios = require('axios')
const AccountModel = require('../models/account.model')
const verificationCode = require('../models/verificationCodes')
const errorCodes = require('../api/constants/errorCodes')
const { contactAccessKey } = require('../config/keys')
const { generateOTP } = require('../api/helpers/helpers')
const { accountStatus, userTypes } = require('../api/constants/TBH.enum')

const populate_admins = async () => {
  const saltKey = bcrypt.genSaltSync(10)
  let password = 'Islam1234'
  let hashed_pass = bcrypt.hashSync(password, saltKey)
  let emailCode = await generateOTP()
  let smsCode = await generateOTP()
  let accountCreated = await AccountModel.create({
    username: 'isanad',
    password: hashed_pass,
    firstName: 'Islam',
    lastName: 'Sanad',
    phone: '01018070815',
    email: 'islam.sanad98@gmail.com',
    status: accountStatus.VERIFIED,
    type: userTypes.ADMIN,
  })
  await verificationCode.create({
    smsCode,
    emailCode,
    emailDate: new Date(),
    smsDate: new Date(),
    accountId: accountCreated.id,
  })

  password = 'Hooda1234'
  hashed_pass = bcrypt.hashSync(password, saltKey)
  accountCreated = await AccountModel.create({
    username: 'hoodaadmin',
    password: hashed_pass,
    firstName: 'Hooda',
    lastName: 'Admin',
    phone: '01005599171',
    email: 'mohammed.mahmoud57@gmail.com',
    status: accountStatus.VERIFIED,
    type: userTypes.ADMIN,
  })
  emailCode = await generateOTP()
  smsCode = await generateOTP()
  await verificationCode.create({
    smsCode,
    emailCode,
    emailDate: new Date(),
    smsDate: new Date(),
    accountId: accountCreated.id,
  })

  password = 'Hoss1234'
  hashed_pass = bcrypt.hashSync(password, saltKey)
  accountCreated = await AccountModel.create({
    username: 'hoss',
    password: hashed_pass,
    firstName: 'Mohamed',
    lastName: 'Hossam',
    phone: '01158280719',
    email: 'mohamed.hossam@lirten.com',
    status: accountStatus.VERIFIED,
    type: userTypes.ADMIN,
  })
  emailCode = await generateOTP()
  smsCode = await generateOTP()
  await verificationCode.create({
    smsCode,
    emailCode,
    emailDate: new Date(),
    smsDate: new Date(),
    accountId: accountCreated.id,
  })

  return { code: errorCodes.success }
}

module.exports = { populate_admins }
