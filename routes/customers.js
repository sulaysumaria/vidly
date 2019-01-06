const Joi = require('joi')
const express = require('express')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
})

const Customer = mongoose.model('customer', customerSchema)

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

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(5)
      .max(50)
      .required(),
    isGold: Joi.boolean(),
  }

  return Joi.validate(customer, schema)
}

module.exports = router
