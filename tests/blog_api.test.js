const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const {
  test, describe, beforeEach, after,
} = require('node:test')

const app = require('../app')
const h = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('Blogs cleared')

  const blogPromises = h.initialBlog
    .map((b) => new Blog(b))
    .map((b) => b.save())

  await Promise.all(blogPromises)

  console.log('beforeEach done')
})

describe('/api/blogs', () => {
  test('received blog amount is correct', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, h.initialBlog.length)
  })

  test('blog identifier is "id" instead of "_id"', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    if (response.body.length !== 0) {
      const blogs = response.body

      const randomCount = Math.floor(Math.random() * blogs.length) + 1

      const randomBlogs = (randomCount > 10)
        ? blogs.slice(0, 10)
        : blogs.slice(0, randomCount)

      randomBlogs.forEach((b) => {
        assert.ok(Object.prototype.hasOwnProperty.call(b, 'id'))
        assert.ok(!Object.prototype.hasOwnProperty.call(b, '_id'))
      })
    }
  })
})

after(async () => { await mongoose.connection.close() })