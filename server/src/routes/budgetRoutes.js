const express = require('express')
const { requireAuth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const budget = require('../controllers/budgetController')

const router = express.Router()

router.use(requireAuth)
router.get('/', budget.getBudget)
router.put('/', budget.validations.upsert, validate, budget.upsertBudget)

module.exports = router

