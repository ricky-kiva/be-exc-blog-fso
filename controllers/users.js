const bcrypt = require('bcrypt')

const r = require('express').Router()
const User = require('../models/user')

r.get('/', async (_, res) => {
  const users = await User
    .find({})
    .populate('blogs', { likes: 0, user: 0 })

  res.json(users)
})

r.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (password.length < 3) {
    return res.status(400).json({
      error: 'password is shorter than the minimum allowed length (3)',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    password: passwordHash,
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = r
