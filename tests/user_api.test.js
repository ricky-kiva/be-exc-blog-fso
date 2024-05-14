const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const {
  test, describe, beforeEach, after,
} = require('node:test')

const app = require('../app')
const h = require('./test_helper')

const User = require('../models/user')

const api = supertest(app)

const USERS_ENDPOINT = '/api/users'

describe.only('when there is initial Users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const hashPasswordPromises = h.initialUser.map(async (u) => {
      const saltRounds = 10
      return { ...u, password: await bcrypt.hash(u.password, saltRounds) }
    })

    const hashedInitialUsers = await Promise.all(hashPasswordPromises)

    await User.insertMany(hashedInitialUsers)
  })

  test('all Users are returned', async () => {
    const response = await api
      .get(USERS_ENDPOINT)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, h.initialUser.length)
  })

  test('User identifier is `id` not `_id`', async () => {
    const response = await api
      .get(USERS_ENDPOINT)
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
      .get(USERS_ENDPOINT)
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

  describe.only('addition of new User', () => {
    test('succeeds with valid data', async () => {
      const user = h.singleUser

      const savedUser = await api
        .post(USERS_ENDPOINT)
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      console.log(savedUser.body)

      const usersAfter = await h.usersInDb()
      assert.strictEqual(usersAfter.length, h.initialUser.length + 1)

      const usernames = usersAfter.map((u) => u.username)
      assert.ok(usernames.includes(savedUser.body.username))
    })

    test('hash the User password', async () => {
      const user = h.singleUser

      await api
        .post(USERS_ENDPOINT)
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await h.usersInDb()
      const userInDb = usersAfter[usersAfter.findIndex((u) => u.username === user.username)]

      assert.ok(userInDb.password !== user.password)
    })

    test.only('fails (status: 400) if data is invalid', async () => {
      const user = { name: 'Falco Grice', password: 'falco123' }

      await api
        .post(USERS_ENDPOINT)
        .send(user)
        .expect(400)

      const usersAfter = await h.usersInDb()

      assert.strictEqual(usersAfter.length, h.initialUser.length)
    })
  })
})

after(async () => { await mongoose.connection.close() })
