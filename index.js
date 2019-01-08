const config = require('config')
const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')

Joi.objectId = require('joi-objectid')(Joi)

const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')

const app = express()

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.')
  process.exit(1)
}

mongoose
  .connect(
    'mongodb://localhost/vidly',
    { useNewUrlParser: true },
  )
  .then(() => console.log('Connected to mongodb.'))
  .catch(() => console.log('Could not connect to mongodb.'))

app.use(express.json())

app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})
