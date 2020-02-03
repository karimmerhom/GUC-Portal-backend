const VerificationCode = require('../../models/verificationCodes')

const generateOTP = async () => {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  const duplicate = await VerificationCode.findOne({ where: { code: text } })
  if (duplicate) {
    return generateOTP()
  }
  return text
}

module.exports = {
  generateOTP
}
