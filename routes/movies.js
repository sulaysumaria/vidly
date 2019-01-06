const express = require('express')

const { Genre } = require('./../models/genre')
const { Movie, validateMovie } = require('./../models/movie')

const router = express.Router()

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name')

  return res.send(movies)
})

router.post('/', async (req, res) => {
  const { error } = validateMovie(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  const genre = await Genre.findById(req.body.genreId)

  if (!genre) {
    return res.status(400).send('Invalid Genre.')
  }

  let movie = new Movie({
    title: req.body.title,
    genre: { _id: genre._id, name: genre.name },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  })

  movie = await movie.save()

  return res.send(movie)
})

router.put('/:id', async (req, res) => {
  const { error } = validateMovie(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  const genre = await Genre.findById(req.body.genreId)

  if (!genre) {
    return res.status(400).send('Invalid Genre.')
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: { _id: genre._id, name: genre.name },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true },
  )

  if (!movie) {
    return res.status(404).send('The movie with the given ID was not found.')
  }

  return res.send(movie)
})

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id)

  if (!movie) {
    return res.status(404).send('The movie with the given ID was not found.')
  }

  return res.send(movie)
})

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id)

  if (!movie) {
    return res.status(404).send('The movie with the given ID was not found.')
  }

  return res.send(movie)
})

module.exports = router
