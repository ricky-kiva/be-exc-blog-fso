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

describe('when there is initial Blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(h.initialBlog)
  })

  test('all Blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, h.initialBlog.length)
  })

  test('Blog identifier is "id" not "_id"', async () => {
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

  describe('addition of a new Blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = h.singleBlog

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAfter = await h.blogsInDb()
      assert.strictEqual(blogsAfter.length, (h.initialBlog.length + 1))

      const titles = blogsAfter.map((b) => b.title)
      assert(titles.includes(newBlog.title))
    })

    test('missing Like property will default to 0', async () => {
      const newBlog = h.singleBlog
      delete newBlog.likes

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAfter = await h.blogsInDb()
      assert.strictEqual(blogsAfter.length, (h.initialBlog.length + 1))

      const addedBlog = blogsAfter[blogsAfter.findIndex((b) => b.title === newBlog.title)]
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails (status: 400) if Title or URL is missing', async () => {
      const assertMissingProperty = async (b) => {
        await api
          .post('/api/blogs')
          .send(b)
          .expect(400)

        const blogsAfter = await h.blogsInDb()
        assert.strictEqual(blogsAfter.length, h.initialBlog.length)
      }

      const blogWithoutTitle = h.singleBlog
      delete blogWithoutTitle.title

      const blogWithoutUrl = h.singleBlog
      delete blogWithoutUrl.url

      const blogToTest = [blogWithoutTitle, blogWithoutUrl]

      const blogPromises = blogToTest
        .map((b) => assertMissingProperty(b))

      await Promise.all(blogPromises)
    })
  })
})

after(async () => { await mongoose.connection.close() })
