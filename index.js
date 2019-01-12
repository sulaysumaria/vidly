const express = require('express')
const winston = require('winston')

const app = express()

require('./startup/validation').validation()
require('./startup/config').checkConfig()
require('./startup/logging').logging()
require('./startup/db').db()
require('./startup/routes').routes(app)

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}.`)
})

module.exports = {
  server,
}
