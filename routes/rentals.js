const express = require('express')
const Fawn = require('fawn')
const mongoose = require('mongoose')

const { auth } = require('./../middleware/auth')

const { Movie } = require('./../models/movie')
const { Customer } = require('./../models/customer')
const { Rental, validateRental } = require('./../models/rental')

const router = express.Router()

Fawn.init(mongoose)

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut')

  return res.send(rentals)
})

router.post('/', auth, async (req, res) => {
  const { error } = validateRental(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  const customer = await Customer.findById(req.body.customerId)

  if (!customer) {
    return res.status(400).send('Invalid Customer.')
  }

  const movie = await Movie.findById(req.body.movieId)

  if (!movie) {
    return res.status(400).send('Invalid Movie.')
  }

  if (movie.numberInStock === 0) {
    return res.status(400).send('Movie not in stock.')
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  })

  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run()

    return res.send(rental)
  } catch (e) {
    console.log(e)

    return res.status(500).send('Something failed.')
  }
})

module.exports = router
