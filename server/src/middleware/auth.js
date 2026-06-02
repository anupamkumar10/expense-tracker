const { ApiError } = require('../utils/ApiError')
const { verifyAccessToken } = require('../utils/tokens')
const { User } = require('../models/User')

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [, token] = header.split(' ')
    if (!token) throw new ApiError(401, 'Missing access token')
    const payload = verifyAccessToken(token)
    const user = await User.findById(payload.sub)
    if (!user) throw new ApiError(401, 'Invalid token')
    req.user = user
    next()
  } catch (err) {
    next(err instanceof ApiError ? err : new ApiError(401, 'Unauthorized'))
  }
}

function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.user) return next(new ApiError(401, 'Unauthorized'))
    if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Forbidden'))
    next()
  }
}

module.exports = { requireAuth, requireRole }

