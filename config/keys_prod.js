module.exports = {
  postgresURI: process.env.POSTGRES_URI,
  secretOrKey: process.env.SECRET,
  salt: process.env.SALT,
  frontEndLink: process.env.FRONTEND_LINK,
  smsAccessKey: process.env.SMS_ACCESS_KEY,
  emailAccessKey: process.env.EMAIL_ACCESS_KEY,
  facebookAuth: {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    redirect_uri_login: process.env.GOOGLE_URI_LOGIN,
    redirect_uri_sign_up: process.env.GOOGLE_URI_SIGNUP,
  },
  googleAuth: {
    client_id: process.env.GOOGLE.CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_ID,
    loginURI: process.env.FACEBOOK_LOGIN_URI,
    signUpURI: process.env.GOOGLE_SIGNUP_URI,
  },
}
