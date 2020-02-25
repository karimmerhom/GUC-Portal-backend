var url = require('url')
var https = require('https')
var queryString = require('querystring')
var fs = require('fs')
const { facebookAuth } = require('../keys_dev')
const axios = require('axios')
var { client_id, client_secret, redirect_uri } = facebookAuth

const get_url = (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: '238318560516660',
    redirect_uri: 'http://localhost:5000/tbhapp/accounts/facebookcallback',
    scope: ['email', 'user_friends'].join(','), // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup'
  })
  const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`
  res.json(facebookLoginUrl)
}

const facebook_callback = (req, res) => {
  getAccessTokenFromCode(req.query.code)
}

async function getAccessTokenFromCode(code) {
  let access_token
  await axios({
    url: 'https://graph.facebook.com/v4.0/oauth/access_token',
    method: 'get',
    params: {
      client_id: '238318560516660',
      client_secret: 'ef2931b0354502b636049074bc1f7bd1',
      redirect_uri: 'http://localhost:5000/tbhapp/accounts/facebookcallback',
      code
    }
  })
    .then(res => {
      console.log(res.data.access_token)
      access_token = res.data.access_token
    })
    .catch(err => console.log(err))
  getFacebookUserData(access_token)
}
let facebookId, firstName, lastName, email
async function getFacebookUserData(accesstoken) {
  await axios({
    url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: accesstoken
    }
  }).then(res => {
    let { data } = res
    facebookId = data.id
    firstName = data.first_name
    lastName = data.last_name
    email = data.email
    console.log(facebookId, firstName, lastName, email)
  })
  return { info: { facebookId, firstName, lastName, email } }
}

module.exports = { get_url, facebook_callback }
