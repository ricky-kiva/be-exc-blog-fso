const bcrypt = require('bcrypt')

const r = require('express').Router()
const User = require('../models/user')

r.get('/', async (_, res) => {
  const users = await User.find({})
  res.json(users)
})

r.post('/', async (req, res) => {
  const { username, name, password } = req.body

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
