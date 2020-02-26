module.exports = {
  postgresURI:
    'postgres://nodems:nodems@odoo.cwkflpbzjgkp.eu-central-1.rds.amazonaws.com:5432/tbh',
  secretOrKey: 'LIRTEN',
  salt: parseInt(10, 10),
  emailAccessKey:
    'U2FsdGVkX19FLC2nYGhTl71zDYq/sB80OXD2NdrgE+BdgDo9hbRuZ3BVaDloo5Rv',
  smsAccessKey:
    'U2FsdGVkX1+qg3LDQcAbEPooS4vnkODpaYuOK3OGMTelyzSpkLxfVJdFfMCHEaGv',
  contactAccessKey:
    'U2FsdGVkX1+ePycHjuV4bc5VZCnpcFFxYucCcgGLoNnp53Ux1f1n3MDhzPFfGvtt',
  bookingExpiry: 86400000,
  facebookAuth: {
    client_id: '238318560516660',
    client_secret: 'ef2931b0354502b636049074bc1f7bd1',
    redirect_uri: 'http://localhost:5000/tbhapp/accounts/facebookcallback'
  },
  googleAuth: {
    client_id:
      '312499848496-1af18a8fr6dqdi6pe1nd1p1llailg7e1.apps.googleusercontent.com',
    client_secret: 'cxRecxM25soJ-MzHNgUa-f23',
    loginURI: 'http://localhost:3000/login',
    signUpURI: 'http://localhost:3000/googlesignup'
  }
}
