module.exports = {
  postgresURI: process.env.POSTGRES_URI,
  secretOrKey: process.env.SECRET,
  salt: process.env.SALT,
  smsAccessKey: process.env.SMS_ACCESS_KEY,
  emailAccessKey: process.env.EMAIL_ACCESS_KEY,
  contactAccessKey: process.env.CONTACT_ACCESS_KEY
}
