const winston = require('winston')
const mongoose = require('mongoose')
const config = require('config')

function db() {
  const db = config.get('db')

  mongoose
    .connect(
      db,
      { useNewUrlParser: true },
    )
    .then(() => winston.info(`Connected to ${db}.`))
}

module.exports = {
  db,
}
