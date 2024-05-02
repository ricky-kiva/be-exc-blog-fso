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

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Unraveling the Mysteries of Dinosaurs: A Journey Through Prehistory',
      author: 'David Johnson',
      url: 'https://www.example.com/dinosaur-mysteries',
      likes: 342,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogsAfter = await h.blogsInDb()
    assert.strictEqual(blogsAfter.length, (h.initialBlog.length + 1))

    const titles = blogsAfter.map((b) => b.title)
    assert(titles.includes(newBlog.title))
  })
})

after(async () => { await mongoose.connection.close() })
