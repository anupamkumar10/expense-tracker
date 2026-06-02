const express = require('express')
const { requireAuth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const analytics = require('../controllers/analyticsController')

const router = express.Router()
router.use(requireAuth)

router.get('/dashboard', analytics.validations.monthQuery, validate, analytics.dashboard)
router.get('/insights', analytics.validations.monthQuery, validate, analytics.insights)
router.get('/charts', analytics.validations.monthQuery, validate, analytics.charts)

module.exports = router

