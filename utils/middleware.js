const logger = require('./logger')

const errorHandler = (err, _, res, next) => {
  logger.error(err.message)

  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  } if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'token invalid' })
  } if (err.name === 'TokenExpiredError') {
    return res.status(401).send({ error: 'token expired' })
  } if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  }

  next(err)
}

module.exports = {
  errorHandler,
}
