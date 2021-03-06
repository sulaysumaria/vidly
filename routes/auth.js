const express = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const { validate } = require('./../middleware/validate')

const { User } = require('./../models/user')

const router = express.Router()

router.post('/', [validate(validateBody)], async (req, res) => {
  let user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(400).send('Invalid email or password.')
  }

  let validPassword = await bcrypt.compare(req.body.password, user.password)

  if (!validPassword) {
    return res.status(400).send('Invalid email or password.')
  }

  const token = user.generateAuthToken()

  return res.send(token)
})

function validateBody(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  }

  return Joi.validate(req, schema)
}

module.exports = router
