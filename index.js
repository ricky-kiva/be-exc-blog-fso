require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (_, res) => {
  Blog
    .find({})
    .then(blogs => { res.json(blogs) })
})

app.post('/api/blogs', (req, res) => {
  const blog = new Blog(req.body)
  console.log(blog)

  blog
    .save()
    .then(result => { res.status(201).json(result) })
})

const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })