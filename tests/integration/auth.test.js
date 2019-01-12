const request = require('supertest')

const { User } = require('./../../models/user')
const { Genre } = require('./../../models/genre')

let server

describe('auth middleware', () => {
  beforeEach(() => {
    token = new User().generateAuthToken()
    server = require('./../../index').server
  })

  afterEach(async () => {
    await Genre.remove({})
    server.close()
  })

  let token
  function exec() {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'Genre1' })
  }

  it('should return 401 if no token is provided', async () => {
    token = ''
    const res = await exec()
    expect(res.status).toBe(401)
  })

  it('should return 400 if invalid token is provided', async () => {
    token = 'hey'
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 200 if token is valid', async () => {
    const res = await exec()
    expect(res.status).toBe(200)
  })
})
