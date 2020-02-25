const { google } = require('googleapis')
const accountModel = require('../../../models/account.model')

const createConnection = () => {
  return new google.auth.OAuth2(
    '312499848496-1af18a8fr6dqdi6pe1nd1p1llailg7e1.apps.googleusercontent.com',
    'cxRecxM25soJ-MzHNgUa-f23',
    'http://localhost:5000/tbhapp/accounts/googlecallback',
    defaultScope
  )
}

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid',
  'profile',
  'email'
]

/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
const getConnectionUrl = auth => {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope
  })
}

const urlGoogle = async (req, res) => {
  const auth = createConnection() // this is from previous step
  const url = getConnectionUrl(auth)
  return res.json({ url })
}

const callback = (req, res) => {
  getGoogleAccountFromCode(req.query.code)
}

const getGoogleAccountFromCode = async code => {
  const auth = createConnection()

  const data = await auth.getToken(code)
  const tokens = data.tokens
  auth.setCredentials(tokens)
  const oAuthClient = google.oauth2({
    auth,
    version: 'v2'
  })
  let userData
  await oAuthClient.userinfo.get().then(res => {
    userData = res.data
  })
  const account = await accountModel.findOne({
    where: { googleId: userData.id }
  })
  if (!account) {
    accountModel.create({
      googleId: userData.id,
      emailVerified: userData.verified_email,
      firstName: userData.given_name,
      lastName: userData.last_name,
      email: userData.email
    })
  }
}

module.exports = { urlGoogle, getGoogleAccountFromCode, callback }
