const express = require('express')
const { requireAuth, requireRole } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const admin = require('../controllers/adminController')

const router = express.Router()

router.use(requireAuth, requireRole('admin'))

router.get('/stats', admin.stats)
router.get('/users', admin.validations.list, validate, admin.listUsers)
router.delete('/users/:id', admin.validations.id, validate, admin.deleteUser)
router.get('/transactions', admin.validations.listTx, validate, admin.listAllTransactions)
router.delete('/transactions/:id', admin.validations.id, validate, admin.deleteTransaction)

module.exports = router

