const express = require('express')
const { requireAuth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const tx = require('../controllers/transactionController')

const router = express.Router()

router.use(requireAuth)

router.get('/', tx.validations.list, validate, tx.listTransactions)
router.get('/export', tx.validations.list, validate, tx.exportCsv)
router.post('/', tx.validations.create, validate, tx.createTransaction)
router.post('/bulk-delete', tx.validations.bulkDelete, validate, tx.bulkDelete)
router.patch('/:id', tx.validations.update, validate, tx.updateTransaction)
router.delete('/:id', tx.validations.remove, validate, tx.deleteTransaction)

module.exports = router

