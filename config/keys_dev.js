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
    client_id: '2576795732450033',
    client_secret: '3ae578321ec74ea2871c329d7464a925',
    redirect_uri: 'http://localhost:5000/config/facebook/callback',
    profileURL:
      'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    profileFields: ['id', 'email', 'name'] // For requesting permissions from Facebook API
  }
}
