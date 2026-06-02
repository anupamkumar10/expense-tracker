const { ApiError } = require('../utils/ApiError')

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'

  const payload = {
    success: false,
    message,
  }
  if (err instanceof ApiError && err.details) payload.details = err.details
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack

  res.status(statusCode).json(payload)
}

module.exports = { errorHandler }

