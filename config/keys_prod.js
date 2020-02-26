module.exports = {
  postgresURI: process.env.POSTGRES_URI,
  secretOrKey: process.env.SECRET,
  salt: process.env.SALT,
  smsAccessKey: process.env.SMS_ACCESS_KEY,
  emailAccessKey: process.env.EMAIL_ACCESS_KEY,
  contactAccessKey: process.env.CONTACT_ACCESS_KEY,
  bookingExpiry: process.env.BOOKING_EXPIRY,
  facebookAuth: {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI
  },
  googleAuth: {
    client_id: process.env.GOOGLE.CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_ID,
    loginURI: process.env.FACEBOOK_LOGIN_URI,
    signUpURI: process.env.GOOGLE_SIGNUP_URI
  }
}
