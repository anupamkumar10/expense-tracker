const express = require('express')
const { body } = require('express-validator')
const { validate } = require('../middleware/validate')
const { requireAuth } = require('../middleware/auth')
const auth = require('../controllers/authController')

const router = express.Router()

router.post(
  '/register',
  [
    body('name').isString().trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8, max: 200 }),
    validate,
  ],
  auth.register,
)

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().isLength({ min: 1, max: 200 }), validate],
  auth.login,
)

router.post('/refresh', auth.refresh)
router.post('/logout', auth.logout)
router.get('/me', requireAuth, auth.me)

module.exports = router

