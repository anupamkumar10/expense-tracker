const bcrypt = require('bcryptjs')
const { User } = require('../models/User')
const { ApiError } = require('../utils/ApiError')
const { asyncHandler } = require('../utils/asyncHandler')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require('../utils/tokens')

function isAdminEmail(email) {
  if (!email) return false
  const configured = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .filter(Boolean)
    .flatMap((v) => String(v).split(','))
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean)
  return configured.includes(String(email).trim().toLowerCase())
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) throw new ApiError(409, 'Email already in use')

  const passwordHash = await bcrypt.hash(password, 12)
  const role = isAdminEmail(email) ? 'admin' : 'user'

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    role,
  })

  res.status(201).json({ success: true, user: user.toSafeJSON() })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(401, 'Invalid credentials')

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw new ApiError(401, 'Invalid credentials')

  // Keep admin permissions in sync with environment bootstrap emails.
  if (isAdminEmail(user.email) && user.role !== 'admin') {
    user.role = 'admin'
  }

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  user.refreshTokenHash = hashToken(refreshToken)
  await user.save()

  setRefreshCookie(res, refreshToken)
  res.json({ success: true, accessToken, user: user.toSafeJSON() })
})

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken
  if (!token) throw new ApiError(401, 'Missing refresh token')

  const payload = verifyRefreshToken(token)
  const user = await User.findById(payload.sub)
  if (!user || !user.refreshTokenHash) throw new ApiError(401, 'Invalid refresh token')

  const matches = user.refreshTokenHash === hashToken(token)
  if (!matches) throw new ApiError(401, 'Invalid refresh token')

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  user.refreshTokenHash = hashToken(refreshToken)
  await user.save()

  setRefreshCookie(res, refreshToken)
  res.json({ success: true, accessToken, user: user.toSafeJSON() })
})

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken
  if (token) {
    try {
      const payload = verifyRefreshToken(token)
      await User.findByIdAndUpdate(payload.sub, { $set: { refreshTokenHash: null } })
    } catch {
      // ignore
    }
  }
  clearRefreshCookie(res)
  res.json({ success: true })
})

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() })
})

module.exports = { register, login, refresh, logout, me }

