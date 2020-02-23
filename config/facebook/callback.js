const queryString = require('query-string')
const axios = require('axios')
const facebookAuth = 

const stringifiedParams = queryString.stringify({
  client_id: process.env.APP_ID_GOES_HERE,
  redirect_uri: 'http://localhost:5000/config/facebook/callback',
  scope: ['email', 'user_friends'].join(','), // comma seperated string
  response_type: 'code',
  auth_type: 'rerequest',
  display: 'popup'
})

const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`

async function getAccessTokenFromCode(code) {
  const { data } = await axios({
    url: 'https://graph.facebook.com/v4.0/oauth/access_token',
    method: 'get',
    params: {
      client_id: ,
      client_secret: process.env.APP_SECRET_GOES_HERE,
      redirect_uri: 'http://localhost:5000/config/facebook/callback',
      code
    }
  })
  console.log(data) // { access_token, token_type, expires_in }
  return data.access_token
}

getAccessTokenFromCode()
