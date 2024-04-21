const Blog = require('../models/blog')
const r = require('express').Router()

r.get('/', (_, res) => {
  Blog
    .find({})
    .then(blogs => { res.json(blogs) })
})

r.post('/', (req, res) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(result => { res.status(201).json(result) })
})

module.exports = r