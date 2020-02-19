const bcrypt = require('bcryptjs')
const axios = require('axios')
const AccountModel = require('../models/account.model')
const errorCodes = require('../api/constants/errorCodes')
const { contactAccessKey } = require('../config/keys')
const { accountStatus, userTypes } = require('../api/constants/TBH.enum')

const populate_users = async () => {
  const saltKey = bcrypt.genSaltSync(10)
  let password = 'Aisha1234'
  let hashed_pass = bcrypt.hashSync(password, saltKey)
  let accountCreated = await AccountModel.create({
    username: 'aisha',
    password: hashed_pass,
    firstName: 'Aisha',
    lastName: 'Shokry',
    phone: '01149196419',
    email: 'aisha.shokry@lirten.com',
    status: accountStatus.PENDING,
    type: userTypes.USER
  })
  await axios({
    method: 'post',
    url: 'https://cubexs.net/contacts/createcontact',
    data: {
      header: {
        accessKey: contactAccessKey
      },
      body: {
        firstName: 'Aisha',
        lastName: 'Shokry',
        email: 'aisha.shokry@lirten.com',
        phoneNumber: '01149196419',
        ownerId: parseInt(accountCreated.id)
      }
    }
  })
  password = 'Radwa123'
  hashed_pass = bcrypt.hashSync(password, saltKey)
  accountCreated = await AccountModel.create({
    username: 'radwa',
    password: hashed_pass,
    firstName: 'Radwa',
    lastName: 'Ragab',
    phone: '01142340509',
    email: 'radwa.ragab@lirten.com',
    status: accountStatus.PENDING,
    type: userTypes.USER
  })
  await axios({
    method: 'post',
    url: 'https://cubexs.net/contacts/createcontact',
    data: {
      header: {
        accessKey: contactAccessKey
      },
      body: {
        firstName: 'Radwa',
        lastName: 'Ragab',
        email: 'radwa.ragab@lirten.com',
        phoneNumber: '01142340509',
        ownerId: parseInt(accountCreated.id)
      }
    }
  })
  password = 'Noura123'
  hashed_pass = bcrypt.hashSync(password, saltKey)
  accountCreated = await AccountModel.create({
    username: 'noura',
    password: hashed_pass,
    firstName: 'Noura',
    lastName: 'Hassan',
    phone: '01098723687',
    email: 'noura.hassan@lirten.com',
    status: accountStatus.PENDING,
    type: userTypes.USER
  })
  await axios({
    method: 'post',
    url: 'https://cubexs.net/contacts/createcontact',
    data: {
      header: {
        accessKey: contactAccessKey
      },
      body: {
        firstName: 'Noura',
        lastName: 'Hassan',
        email: 'noura.hassan@lirten.com',
        phoneNumber: '01098723687',
        ownerId: parseInt(accountCreated.id)
      }
    }
  })
  // password = 'Hooda1234'
  // hashed_pass = bcrypt.hashSync(password, saltKey)
  // accountCreated = await AccountModel.create({
  //   username: 'hooda',
  //   password: hashed_pass,
  //   firstName: 'Hooda',
  //   lastName: 'Mahmoud',
  //   phone: '01005599171',
  //   email: 'elhobbakhaless@gmail.com',
  //   status: accountStatus.VERIFIED,
  //   type: userTypes.USER
  // })
  // await axios({
  //   method: 'post',
  //   url: 'https://cubexs.net/contacts/createcontact',
  //   data: {
  //     header: {
  //       accessKey: contactAccessKey
  //     },
  //     body: {
  //       firstName: 'Hooda',
  //       lastName: 'Mahmoud',
  //       email: 'elhobbakhaless@gmail.com',
  //       phoneNumber: '01005599171',
  //       ownerId: parseInt(accountCreated.id)
  //     }
  //   }
  // })
  return { code: errorCodes.success }
}

module.exports = { populate_users }
