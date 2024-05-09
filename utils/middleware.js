const logger = require('./logger')

// eslint-disable-next-line consistent-return
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
