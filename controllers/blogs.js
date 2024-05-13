const r = require('express').Router()
const Blog = require('../models/blog')

const h = require('../tests/test_helper')

r.get('/', async (_, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  res.json(blogs)
})

r.post('/', async (req, res) => {
  const { body } = req

  if (!body.title || !body.url) {
    res.status(400).end()
    return
  }

  const usersInDb = await h.usersInDb()
  const randomUser = usersInDb[Math.floor(Math.random() * usersInDb.length)]

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: randomUser.id,
  })

  const savedBlog = await blog.save()

  res.status(201).json(savedBlog)
})

r.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

r.put('/:id', async (req, res) => {
  const { body } = req
  const { id } = req.params

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
  res.status(201).json(updatedBlog)
})

module.exports = r
