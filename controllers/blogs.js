const r = require('express').Router()
const Blog = require('../models/blog')

r.get('/', (_, res) => {
  Blog
    .find({})
    .then((blogs) => { res.json(blogs) })
})

r.post('/', (req, res) => {
  const { body } = req

  if (!body.title || !body.url) {
    res.status(400).end()
    return
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  blog
    .save()
    .then((result) => { res.status(201).json(result) })
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
