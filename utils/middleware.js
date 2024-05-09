const logger = require('./logger')

const errorHandler = (err, _, res, next) => {
  logger.error(err.message)

  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }

  next(err)
}

module.exports = {
  errorHandler,
}
