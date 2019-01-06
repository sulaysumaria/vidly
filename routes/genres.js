const Joi = require('joi')
const express = require('express')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
})

const Genre = mongoose.model('genre', genreSchema)

const router = express.Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name')

  return res.send(genres)
})

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  let genre = new Genre({ name: req.body.name })

  genre = await genre.save()

  return res.send(genre)
})

router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  return res.send(genre)
})

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  return res.send(genre)
})

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id)

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

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

module.exports = router
