const { google } = require('googleapis')
const errorCodes = require('../../constants/errorCodes')
const axios = require('axios')

const createConnection = () => {
  return new google.auth.OAuth2(
    '312499848496-1af18a8fr6dqdi6pe1nd1p1llailg7e1.apps.googleusercontent.com',
    'cxRecxM25soJ-MzHNgUa-f23',
    'http://localhost:3000/googlesignup',
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

const callback = async (req, res) => {
  const info = await getGoogleAccountFromCode(req.data.code)
  return res.json({ info })
}

const getGoogleAccountFromCode = async code => {
  try {
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
    return { userData }
  } catch (exception) {
    console.log(exception)
    return { code: errorCodes.unknown, error: 'Something went wrong' }
  }
}

const register_google = async () => {
  axios({
    method: 'post',
    url: 'https://cubexs.net/tbhapp/accounts/registergoogle',
    data: {
      Account: {
        id: userData.id,
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        phoneNumber: '01158280719',
        username: 'hosss'
      }
    }
  }).then(res => console.log(res))
  return { code: errorCodes.success }
}
const login_google = async () => {
  axios({
    method: 'post',
    url: 'https://cubexs.net/tbhapp/accounts/registergoogle',
    data: {
      Account: {
        id: userData.id,
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        phoneNumber: '01158280719',
        username: 'hosss'
      }
    }
  }).then(res => console.log(res))
  return { code: errorCodes.success }
}

module.exports = { urlGoogle, getGoogleAccountFromCode, callback }
