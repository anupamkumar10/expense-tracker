const { query, param } = require('express-validator')
const { User } = require('../models/User')
const { Transaction } = require('../models/Transaction')
const { ApiError } = require('../utils/ApiError')
const { asyncHandler } = require('../utils/asyncHandler')

const stats = asyncHandler(async (req, res) => {
  const [usersCount, txCount, totals] = await Promise.all([
    User.countDocuments({}),
    Transaction.countDocuments({}),
    Transaction.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
  ])

  let income = 0
  let expense = 0
  for (const r of totals) {
    if (r._id === 'income') income = r.total
    if (r._id === 'expense') expense = r.total
  }

  res.json({
    success: true,
    stats: {
      users: usersCount,
      transactions: txCount,
      incomeVolume: income,
      expenseVolume: expense,
    },
  })
})

const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1))
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)))
  const skip = (page - 1) * limit

  const q = req.query.q ? String(req.query.q).trim() : ''
  const filter = {}
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: re }, { email: re }]
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ])

  res.json({
    success: true,
    users: items.map((u) => u.toSafeJSON()),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
})

const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) throw new ApiError(400, 'Cannot delete yourself')
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) throw new ApiError(404, 'User not found')
  await Transaction.deleteMany({ userId: user._id })
  res.json({ success: true })
})

const listAllTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1))
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)))
  const skip = (page - 1) * limit

  const filter = {}
  if (req.query.userId) filter.userId = req.query.userId
  if (req.query.type) filter.type = req.query.type
  if (req.query.category) filter.category = req.query.category
  if (req.query.startDate || req.query.endDate) {
    filter.date = {}
    if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate)
    if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate)
  }

  const [items, total] = await Promise.all([
    Transaction.find(filter).populate('userId', 'name email role').sort({ date: -1, _id: -1 }).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ])

  res.json({
    success: true,
    transactions: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
})

const deleteTransaction = asyncHandler(async (req, res) => {
  const tx = await Transaction.findByIdAndDelete(req.params.id)
  if (!tx) throw new ApiError(404, 'Transaction not found')
  res.json({ success: true })
})

const validations = {
  list: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('q').optional().isString().trim().isLength({ min: 1, max: 200 }),
  ],
  listTx: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('userId').optional().isMongoId(),
    query('type').optional().isIn(['income', 'expense']),
    query('category').optional().isString().trim().isLength({ min: 1, max: 60 }),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  id: [param('id').isMongoId()],
}

module.exports = { stats, listUsers, deleteUser, listAllTransactions, deleteTransaction, validations }

