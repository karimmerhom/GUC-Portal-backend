var url = require('url')
var https = require('https')
var queryString = require('querystring')
var fs = require('fs')
const { facebookAuth } = require('../keys_dev')
var { client_id, client_secret, redirect_uri } = facebookAuth

function getCookies(email, password, callback) {
  var data = queryString.stringify({
    email: email,
    pass: password,
    default_persistent: '1',
    timezone: '-120'
  })

  var fbGetCookieHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
    Cookie: '_js_reg_fb_gate=null',
    Host: 'www.facebook.com',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(data)
  }

  var fbGetCookieOptions = {
    protocol: 'https:',
    hostname: 'www.facebook.com',
    path: '/login.php?login_attempt=1&lwv=110',
    method: 'POST',
    headers: fbGetCookieHeaders
  }

  function findCookie(name, cookies) {
    return new RegExp(name + '=(.+?);').exec(cookies)
  }

  var req = https.request(fbGetCookieOptions, res => {
    var cookies = res.headers['set-cookie'].toString()
    var c_user = findCookie('c_user', cookies)
    var xs = findCookie('xs', cookies)
    callback({ c_user: c_user, xs: xs })
  })

  req.write(data)
  req.end()
}

function logIn(cookies, callback) {
  var fbHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
    Cookie: 'c_user=' + cookies.c_user + '; xs=' + cookies.xs,
    Host: 'www.facebook.com'
  }

  var fbOptions = {
    protocol: 'https:',
    hostname: 'www.facebook.com',
    path:
      '/dialog/oauth?client_id=' + client_id + '&redirect_uri=' + redirect_uri,
    headers: fbHeaders
  }

  https
    .request(fbOptions)
    .on('response', response => {
      var loginCode = url.parse(response.headers.location, true).query.code
      callback(loginCode)
    })
    .end()
}

function getAccessToken(loginCode, callback) {
  var graphHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
    Host: 'graph.facebook.com'
  }

  var graphOptions = {
    protocol: 'https:',
    hostname: 'graph.facebook.com',
    path:
      '/v2.3/oauth/access_token?client_id=' +
      client_id +
      '&redirect_uri=' +
      redirect_uri +
      '/&client_secret=' +
      client_secret +
      '&code=' +
      loginCode,
    headers: graphHeaders
  }

  https
    .request(graphOptions, response => {
      response.on('data', function(chunk) {
        callback(JSON.parse(chunk.toString('utf-8')).access_token)
      })
    })
    .end()
}

getCookies('mohamedhoss_1998@hotmail.com', '', receivedCookies)

function receivedCookies(cookies) {
  logIn(cookies, loggedIn)
}

function loggedIn(loginCode) {
  getAccessToken(loginCode, receivedToken)
}

function receivedToken(accessToken) {
  console.log(accessToken)
}
