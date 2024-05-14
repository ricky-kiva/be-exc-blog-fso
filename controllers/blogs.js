const jwt = require('jsonwebtoken')
const r = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (req) => {
  const auth = req.get('authorization')

  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '')
  }

  return null
}

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

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.JWT_SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

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
