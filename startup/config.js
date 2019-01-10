const config = require('config')

function checkConfig() {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')
  }
}

module.exports = { checkConfig }
