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
    type: userTypes.ADMIN
  })
  await axios({
    method: 'post',
    url: 'http://localhost:2003/contacts/createcontact',
    data: {
      header: {
        accessKey: contactAccessKey
      },
      body: {
        firstName: 'Islam',
        lastName: 'Sanad',
        email: 'islam.sanad98@gmail.com',
        phoneNumber: '01018070815',
        ownerId: parseInt(accountCreated.id)
      }
    }
  })
  password = 'Samar1234'
  hashed_pass = bcrypt.hashSync(password, saltKey)
  accountCreated = await AccountModel.create({
    username: 'samarashery',
    password: hashed_pass,
    firstName: 'Samar',
    lastName: 'Ashery',
    phone: '01141988757',
    email: 'samar.ashery@lirten.com',
    status: accountStatus.VERIFIED,
    type: userTypes.ADMIN
  })
  await axios({
    method: 'post',
    url: 'http://localhost:2003/contacts/createcontact',
    data: {
      header: {
        accessKey: contactAccessKey
      },
      body: {
        firstName: 'Samar',
        lastName: 'Ashery',
        email: 'samar.ashery@lirten.com',
        phoneNumber: '01141988757',
        ownerId: parseInt(accountCreated.id)
      }
    }
  })
  // password = 'Hooda1234'
  // hashed_pass = bcrypt.hashSync(password, saltKey)
  // accountCreated = await AccountModel.create({
  //   username: 'hoodaadmin',
  //   password: hashed_pass,
  //   firstName: 'Hooda',
  //   lastName: 'Admin',
  //   phone: '01005599171',
  //   email: 'mohammed.mahmoud57@gmail.com',
  //   status: accountStatus.VERIFIED,
  //   type: userTypes.ADMIN
  // })
  // await axios({
  //   method: 'post',
  //   url: 'http://localhost:2003/contacts/createcontact',
  //   data: {
  //     header: {
  //       accessKey: contactAccessKey
  //     },
  //     body: {
  //       firstName: 'Hooda',
  //       lastName: 'Admin',
  //       email: 'mohammed.mahmoud@gmail.com',
  //       phoneNumber: '01005599171',
  //       ownerId: parseInt(accountCreated.id)
  //     }
  //   }
  // })
  return { code: errorCodes.success }
}

module.exports = { populate_admins }
