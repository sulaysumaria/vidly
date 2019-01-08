const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')

const { auth } = require('./../middleware/auth')

const { User, validateUser } = require('./../models/user')

const router = express.Router()

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  return res.send(user)
})

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body)

  if (error) {
    let errorMessage = ''
    error.details.map(d => (errorMessage += d.message))

    return res.status(400).send(errorMessage)
  }

  let user = await User.findOne({ email: req.body.email })

  if (user) {
    return res.status(400).send('User already registered.')
  }

  user = new User(_.pick(req.body, ['name', 'email', 'password']))

  const salt = await bcrypt.genSalt(10)

  user.password = await bcrypt.hash(user.password, salt)

  await user.save()

  const token = user.generateAuthToken()

  res.header('x-auth-token', token)

  return res.send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router
