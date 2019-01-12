const express = require('express')

const { auth } = require('./../middleware/auth')
const { admin } = require('./../middleware/admin')
const { validateObjectId } = require('./../middleware/validateObjectId')
const { validate } = require('./../middleware/validate')

const { Genre, validateGenre } = require('./../models/genre')

const router = express.Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name')

  return res.send(genres)
})

router.post('/', [auth, validate(validateGenre)], async (req, res) => {
  const genre = new Genre({ name: req.body.name })

  await genre.save()

  return res.send(genre)
})

router.put('/:id', [auth, validateObjectId, validate(validateGenre)], async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  return res.send(genre)
})

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  return res.send(genre)
})

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id)

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  return res.send(genre)
})

module.exports = router
