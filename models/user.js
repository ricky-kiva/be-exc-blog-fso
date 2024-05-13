/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (_, returnObj) => {
    returnObj.id = returnObj._id.toString()
    delete returnObj.password
    delete returnObj.__v
    delete returnObj._id
  },
})

module.exports = mongoose.model('User', userSchema)
