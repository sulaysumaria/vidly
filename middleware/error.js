const winston = require('winston')

function error(err, req, res) {
  winston.error(err.message, err)
  return res.status(500).send('Something failed.')
}

module.exports = {
  error,
}
