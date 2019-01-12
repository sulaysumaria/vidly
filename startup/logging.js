require('express-async-errors')
const winston = require('winston')

function logging() {
  process.on('unhandledRejection', e => {
    throw e
  })

  process.on('uncaughtException', e => {
    throw e
  })

  winston.add(new winston.transports.File({ filename: 'logfile.log', handleExceptions: true }))

  if (process.env.NODE_ENV !== 'test') {
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }))
  }
}

module.exports = {
  logging,
}
