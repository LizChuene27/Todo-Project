const request = require('supertest')
const app = require('../../../backend/app');

describe('Backend: Login Tests', () => {
  
  it('should give login success response', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: "admin",
        password: "admin",
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('access_token')
  })

  it('should give login error response', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: "admin",
        password: "fakepass",
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')
  })
})