const mongoose = require('mongoose')

const { auth } = require('./../../../middleware/auth')

const { User } = require('./../../../models/user')

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true }
    const token = new User(payload).generateAuthToken()

    const req = {
      header: jest.fn().mockReturnValue(token),
    }
    const next = jest.fn()
    const res = {}

    auth(req, res, next)

    expect(req.user).toMatchObject(payload)
  })
})
