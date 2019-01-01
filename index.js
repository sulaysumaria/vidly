const Joi = require('joi')
const express = require('express')

const app = express()

app.use(express.json())

const genres = [{ id: 1, name: 'Action' }, { id: 2, name: 'Horror' }, { id: 3, name: 'Romance' }]

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.get('/api/genres', (req, res) => {
  return res.send(genres)
})

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  return res.send(genre)
})

app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  }

  genres.push(genre)

  return res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  const { error } = validateGenre(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  genre.name = req.body.name

  return res.send(genre)
})

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  const index = genres.indexOf(genre)

  genres.splice(index, 1)

  return res.send(genre)
})

function validateGenre(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
  }

  return Joi.validate(course, schema)
}

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})
