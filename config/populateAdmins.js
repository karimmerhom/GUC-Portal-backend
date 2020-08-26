const bcrypt = require('bcryptjs')
const axios = require('axios')
const AccountModel = require('../models/account.model')
const errorCodes = require('../api/constants/errorCodes')
const { contactAccessKey } = require('../config/keys')
const { accountStatus, userTypes } = require('../api/constants/TBH.enum')

const populate_admins = async () => {
  const saltKey = bcrypt.genSaltSync(10)
  let password = 'Islam1234'
  let hashed_pass = bcrypt.hashSync(password, saltKey)
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

  return { code: errorCodes.success }
}

module.exports = { populate_admins }
