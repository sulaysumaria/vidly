const express = require('express')

const { Customer, validateCustomer } = require('./../models/customer')

const router = express.Router()

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name')

  return res.send(customers)
})

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  let customer = new Customer({ name: req.body.name, phone: req.body.phone, isGold: req.body.isGold })

  customer = await customer.save()

  return res.send(customer)
})

router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true },
  )

  if (!customer) {
    return res.status(404).send('The customer with the given ID was not found.')
  }

  return res.send(customer)
})

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id)

  if (!customer) {
    return res.status(404).send('The customer with the given ID was not found.')
  }

  return res.send(customer)
})

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id)

  if (!customer) {
    return res.status(404).send('The customer with the given ID was not found.')
  }

  return res.send(customer)
})

module.exports = router
