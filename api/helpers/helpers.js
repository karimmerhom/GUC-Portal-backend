const generateOTP = async () => {
  let text = ''
  const possible = 'abcdefghijkmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

module.exports = {
  generateOTP,
}
