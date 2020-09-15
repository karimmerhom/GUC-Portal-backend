const { google } = require('googleapis')
const errorCodes = require('../../constants/errorCodes')
const validator = require('../../helpers/validations/accountValidations')
const { googleAuth } = require('../../../config/keys')
const createConnection = (uri) => {
  return new google.auth.OAuth2(
    googleAuth.client_id,
    googleAuth.client_secret,
    uri,
    defaultScope
  )
}

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid',
  'profile',
  'email',
]

/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
const getConnectionUrl = (auth) => {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope,
  })
}

const urlGoogle = async (req, res) => {
  let uri
  console.log(googleAuth)
  const { state } = req.body
  if (state === 'signUp') {
    uri = googleAuth.signUpURI
  }
  if (state === 'signIn') {
    uri = googleAuth.loginURI
  }
  if (state === 'link') {
    uri = googleAuth.link
  }
  const auth = createConnection(uri) // this is from previous step
  const url = getConnectionUrl(auth)
  return res.json({ url })
}

const callback = async (req, res) => {
  if (!req.query.code) {
    return res.json({
      statusCode: errorCodes.validation,
      error: 'Missing code',
    })
  }
  const { state } = req.body
  const info = await getGoogleAccountFromCode(req.query.code, state)
  return res.json({ statusCode: 0, info })
}

const getGoogleAccountFromCode = async (code, state) => {
  try {
    let uri
    if (state === 'signUp') {
      uri = googleAuth.signUpURI
    }
    if (state === 'signIn') {
      uri = googleAuth.loginURI
    }
    if (state === 'link') {
      uri = googleAuth.link
    }
    const auth = createConnection(uri)
    console.log(auth)

    const data = await auth.getToken(code)
    const tokens = data.tokens
    auth.setCredentials(tokens)
    const oAuthClient = google.oauth2({
      auth,
      version: 'v2',
    })
    let userData
    await oAuthClient.userinfo.get().then((res) => {
      userData = res.data
    })
    return { userData }
  } catch (exception) {
    console.log(exception)
    return { statusCode: errorCodes.unknown, error: 'Something went wrong' }
  }
}

module.exports = { urlGoogle, getGoogleAccountFromCode, callback }
