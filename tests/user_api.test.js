const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const {
  test, describe, beforeEach, after,
} = require('node:test')

const app = require('../app')
const h = require('./test_helper')

const User = require('../models/user')

const api = supertest(app)

describe('when there is initial Users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(h.initialUser)
  })

  test('all Users are returned', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, h.initialUser.length)
  })

  test('User identifier is `id` not `_id`', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const users = response.body

    if (users.length !== 0) {
      const randomCount = Math.floor(Math.random() * users.length) + 1

      const randomUsers = (randomCount > 10)
        ? users.slice(0, 10)
        : users.slice(0, randomCount)

      randomUsers.forEach((u) => {
        assert.ok(!Object.prototype.hasOwnProperty.call(u, '_id'))
        assert.ok(Object.prototype.hasOwnProperty.call(u, 'id'))
      })
    }
  })

  test('password is not listed as property when requesting Users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const users = response.body

    if (users.length !== 0) {
      const randomCount = Math.floor(Math.random() * users.length) + 1

      const randomUsers = (randomCount > 10)
        ? users.slice(0, 10)
        : users.slice(0, randomCount)

      randomUsers.forEach(async (u) => {
        assert.ok(!Object.prototype.hasOwnProperty.call(u, 'password'))
      })
    }
  })

  test('password is hashed in DB', async () => {
    const usersInDb = await h.usersInDb()

    const targetUser = h.initialUser[0]

    const user = usersInDb[usersInDb.findIndex((u) => u.username === targetUser.username)]

    assert.notStrictEqual(user.password, targetUser.password)
  })
})

after(async () => { mongoose.connection.close() })
