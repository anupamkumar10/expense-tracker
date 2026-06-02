const { body, param, query } = require('express-validator')
const { Transaction } = require('../models/Transaction')
const { ApiError } = require('../utils/ApiError')
const { asyncHandler } = require('../utils/asyncHandler')

function buildFilters(req) {
  const { type, category, startDate, endDate, q } = req.query
  const filter = { userId: req.user._id }

  if (type) filter.type = type
  if (category) filter.category = category

  if (startDate || endDate) {
    filter.date = {}
    if (startDate) filter.date.$gte = new Date(startDate)
    if (endDate) filter.date.$lte = new Date(endDate)
  }

  if (q) {
    const re = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ note: re }, { category: re }]
  }

  return filter
}

const createTransaction = asyncHandler(async (req, res) => {
  const { amount, type, category, note, date } = req.body

  const tx = await Transaction.create({
    userId: req.user._id,
    amount,
    type,
    category,
    note: note || '',
    date: new Date(date),
  })

  res.status(201).json({ success: true, transaction: tx })
})

const listTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1))
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)))
  const skip = (page - 1) * limit

  const sortBy = req.query.sortBy === 'amount' ? 'amount' : 'date'
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
  const sort = { [sortBy]: sortOrder, _id: -1 }

  const filter = buildFilters(req)

  const [items, total] = await Promise.all([
    Transaction.find(filter).sort(sort).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ])

  res.json({
    success: true,
    transactions: items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
})

const updateTransaction = asyncHandler(async (req, res) => {
  const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user._id })
  if (!tx) throw new ApiError(404, 'Transaction not found')

  const { amount, type, category, note, date } = req.body
  if (amount !== undefined) tx.amount = amount
  if (type) tx.type = type
  if (category) tx.category = category
  if (note !== undefined) tx.note = note
  if (date) tx.date = new Date(date)

  await tx.save()
  res.json({ success: true, transaction: tx })
})

const deleteTransaction = asyncHandler(async (req, res) => {
  const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
  if (!tx) throw new ApiError(404, 'Transaction not found')
  res.json({ success: true })
})

const bulkDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids) || ids.length === 0) throw new ApiError(400, 'ids must be a non-empty array')
  const result = await Transaction.deleteMany({ _id: { $in: ids }, userId: req.user._id })
  res.json({ success: true, deletedCount: result.deletedCount })
})

const exportCsv = asyncHandler(async (req, res) => {
  const filter = buildFilters(req)
  const items = await Transaction.find(filter).sort({ date: -1, _id: -1 })

  const header = ['date', 'type', 'category', 'amount', 'note']
  const lines = [header.join(',')]
  for (const t of items) {
    const row = [
      new Date(t.date).toISOString(),
      t.type,
      t.category,
      String(t.amount),
      String(t.note || '').replaceAll('"', '""'),
    ]
    lines.push([row[0], row[1], row[2], row[3], `"${row[4]}"`].join(','))
  }

  const csv = lines.join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"')
  res.status(200).send(csv)
})

const validations = {
  create: [
    body('amount').isFloat({ min: 0 }).toFloat(),
    body('type').isIn(['income', 'expense']),
    body('category').isString().trim().isLength({ min: 1, max: 60 }),
    body('note').optional().isString().trim().isLength({ max: 500 }),
    body('date').isISO8601(),
  ],
  update: [
    param('id').isMongoId(),
    body('amount').optional().isFloat({ min: 0 }).toFloat(),
    body('type').optional().isIn(['income', 'expense']),
    body('category').optional().isString().trim().isLength({ min: 1, max: 60 }),
    body('note').optional().isString().trim().isLength({ max: 500 }),
    body('date').optional().isISO8601(),
  ],
  list: [
    query('page').optional().isInt({ min: 1, max: 100000 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('type').optional().isIn(['income', 'expense']),
    query('category').optional().isString().trim().isLength({ min: 1, max: 60 }),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('sortBy').optional().isIn(['date', 'amount']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
    query('q').optional().isString().trim().isLength({ min: 1, max: 200 }),
  ],
  remove: [param('id').isMongoId()],
  bulkDelete: [
    body('ids').isArray({ min: 1 }),
    body('ids.*').isMongoId(),
  ],
}

module.exports = {
  createTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
  bulkDelete,
  exportCsv,
  validations,
}

