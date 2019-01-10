const winston = require('winston')
const mongoose = require('mongoose')

function db() {
  mongoose
    .connect(
      'mongodb://localhost/vidly',
      { useNewUrlParser: true },
    )
    .then(() => winston.info('Connected to mongodb.'))
}

module.exports = {
  db,
}
