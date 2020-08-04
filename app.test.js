var request = require('supertest')
var app = require('./app.js')

describe('Test app', () => {
  it('Should response to root (GET method)', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('')
  })
})

describe('Test app', () => {
  it('Should response error to unknown path', async () => {
    const response = await request(app).get('/error/error-path')
    expect(response.statusCode).toBe(404)
  })
})
