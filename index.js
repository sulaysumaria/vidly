const express = require('express')
const mongoose = require('mongoose')
const Joi = require('Joi')

Joi.objectId = require('joi-objectid')(Joi)

const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')

const app = express()

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

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})
