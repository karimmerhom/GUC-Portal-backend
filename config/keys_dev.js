module.exports = {
  postgresURI:
    'postgres://tbh_read_write:tbh_read_write@odoo.cwkflpbzjgkp.eu-central-1.rds.amazonaws.com:5432/tbh-dev',
  secretOrKey: 'SECRET',
  frontEndLink: 'https://uat.thebusinesshub.space',
  salt: '10',
  smsAccessKey:
    'U2FsdGVkX19jTU8iULYNra7x0VyjoXNs0rf40VHMxCcgvRpBXUGGNDK3UbBNrlQC',
  emailAccessKey:
    'U2FsdGVkX1+Pz14wn/aXsoqSwTElHadaE+25YHTh07QBI4CqljgVNfCO20NPhArz',
  facebookAuth: {
    client_id: '220638332401032',
    client_secret: 'b0c3014038aa4771ff2d6bc725515df5',
    redirect_uri_login: 'http://localhost:3000/facebook/SignIn',
    redirect_uri_sign_up: 'http://localhost:3000/facebook/SignUp',
  },
  googleAuth: {
    client_id:
      '790311029308-uok5sjd316a26f6mjhq6ff6rlg1t8dfi.apps.googleusercontent.com',
    client_secret: 'HnlkzK0HJpJUR1BXW1XC_67U',
    loginURI: 'http://localhost:3000/google/SignIn',
    signUpURI: 'http://localhost:3000/google/SignUp',
  },
}
