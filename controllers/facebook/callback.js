var queryString = require('querystring')
const { facebookAuth } = require('../../../config/keys')
const axios = require('axios')
var {
  client_id,
  client_secret,
  redirect_uri_login,
  redirect_uri_sign_up,
  link,
} = facebookAuth
const errorCodes = require('../../constants/errorCodes')
const validator = require('../../helpers/validations/accountValidations')

const get_url = (req, res) => {
  let uri
  const { state } = req.body
  if (state === 'signUp') {
    uri = redirect_uri_sign_up
  }
  if (state === 'signIn') {
    uri = redirect_uri_login
  }
  if (state === 'link') {
    uri = link
  }
  const stringifiedParams = queryString.stringify({
    client_id,
    redirect_uri: uri,
    scope: ['email'].join(','), // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  })
  const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`
  return res.json(facebookLoginUrl)
}

const facebook_callback = async (req, res) => {
  try {
    if (!req.query.code) {
      return res.json({ statusCode: errorCodes.validation })
    }
    const { state } = req.body
    const data = await getAccessTokenFromCode(req.query.code, state)
    return res.json({ statusCode: errorCodes.success, data })
  } catch (exception) {
    return res.json({
      statusCode: errorCodes.unknown,
      error: 'Something went wrong',
    })
  }
}

async function getAccessTokenFromCode(code, state) {
  try {
    let access_token
    let uri
    if (state === 'signUp') {
      uri = redirect_uri_sign_up
    }
    if (state === 'signIn') {
      uri = redirect_uri_login
    }
    if (state === 'link') {
      uri = link
    }
    await axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'get',
      params: {
        client_id,
        client_secret,
        redirect_uri: uri,
        code,
      },
    })
      .then((res) => {
        access_token = res.data.access_token
      })
      .catch((err) => console.log(err))
    const data = await getFacebookUserData(access_token)
    return data
  } catch (exception) {
    return { statusCode: errorCodes.unknown, error: 'Something went wrong' }
  }
}
async function getFacebookUserData(accesstoken) {
  try {
    let facebookId, firstName, lastName, email
    await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: accesstoken,
      },
    }).then((res) => {
      let { data } = res
      facebookId = data.id
      firstName = data.first_name
      lastName = data.last_name
      email = data.email
    })
    return { facebookId, firstName, lastName, email }
  } catch (exception) {
    return { statusCode: errorCodes.unknown, error: 'Something went wrong' }
  }
}

module.exports = { get_url, facebook_callback }
