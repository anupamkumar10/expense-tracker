const { body, param } = require('express-validator')
const { SavingsGoal } = require('../models/SavingsGoal')
const { RecurringTransaction } = require('../models/RecurringTransaction')
const { UpcomingBill } = require('../models/UpcomingBill')
const { ApiError } = require('../utils/ApiError')
const { asyncHandler } = require('../utils/asyncHandler')

// ——— Savings Goals ———
const listSavingsGoals = asyncHandler(async (req, res) => {
  const items = await SavingsGoal.find({ userId: req.user._id }).sort({ targetDate: 1 })
  res.json({ success: true, items })
})

const createSavingsGoal = asyncHandler(async (req, res) => {
  const item = await SavingsGoal.create({ ...req.body, userId: req.user._id })
  res.status(201).json({ success: true, item })
})

const updateSavingsGoal = asyncHandler(async (req, res) => {
  const item = await SavingsGoal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true },
  )
  if (!item) throw new ApiError(404, 'Savings goal not found')
  res.json({ success: true, item })
})

const deleteSavingsGoal = asyncHandler(async (req, res) => {
  const item = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
  if (!item) throw new ApiError(404, 'Savings goal not found')
  res.json({ success: true })
})

// ——— Recurring ———
const listRecurring = asyncHandler(async (req, res) => {
  const items = await RecurringTransaction.find({ userId: req.user._id }).sort({ nextDueDate: 1 })
  res.json({ success: true, items })
})

const createRecurring = asyncHandler(async (req, res) => {
  const item = await RecurringTransaction.create({ ...req.body, userId: req.user._id })
  res.status(201).json({ success: true, item })
})

const updateRecurring = asyncHandler(async (req, res) => {
  const item = await RecurringTransaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true },
  )
  if (!item) throw new ApiError(404, 'Recurring transaction not found')
  res.json({ success: true, item })
})

const deleteRecurring = asyncHandler(async (req, res) => {
  const item = await RecurringTransaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
  if (!item) throw new ApiError(404, 'Recurring transaction not found')
  res.json({ success: true })
})

// ——— Bills ———
const listBills = asyncHandler(async (req, res) => {
  const items = await UpcomingBill.find({ userId: req.user._id }).sort({ dueDate: 1 })
  res.json({ success: true, items })
})

const createBill = asyncHandler(async (req, res) => {
  const item = await UpcomingBill.create({ ...req.body, userId: req.user._id })
  res.status(201).json({ success: true, item })
})

const updateBill = asyncHandler(async (req, res) => {
  const item = await UpcomingBill.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true },
  )
  if (!item) throw new ApiError(404, 'Bill not found')
  res.json({ success: true, item })
})

const deleteBill = asyncHandler(async (req, res) => {
  const item = await UpcomingBill.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
  if (!item) throw new ApiError(404, 'Bill not found')
  res.json({ success: true })
})

const savingsValidations = {
  create: [
    body('name').isString().trim().isLength({ min: 1, max: 120 }),
    body('savingsType').optional().isIn(['emergency', 'vacation', 'investment', 'education', 'other']),
    body('targetAmount').isFloat({ min: 0 }).toFloat(),
    body('currentAmount').optional().isFloat({ min: 0 }).toFloat(),
    body('targetDate').isISO8601(),
    body('note').optional().isString().trim().isLength({ max: 500 }),
  ],
  update: [
    param('id').isMongoId(),
    body('name').optional().isString().trim().isLength({ min: 1, max: 120 }),
    body('savingsType').optional().isIn(['emergency', 'vacation', 'investment', 'education', 'other']),
    body('targetAmount').optional().isFloat({ min: 0 }).toFloat(),
    body('currentAmount').optional().isFloat({ min: 0 }).toFloat(),
    body('targetDate').optional().isISO8601(),
    body('note').optional().isString().trim().isLength({ max: 500 }),
  ],
  id: [param('id').isMongoId()],
}

const recurringValidations = {
  create: [
    body('title').isString().trim().isLength({ min: 1, max: 120 }),
    body('amount').isFloat({ min: 0 }).toFloat(),
    body('type').isIn(['income', 'expense']),
    body('category').isString().trim().isLength({ min: 1, max: 60 }),
    body('frequency').optional().isIn(['weekly', 'monthly', 'yearly']),
    body('nextDueDate').isISO8601(),
    body('note').optional().isString().trim().isLength({ max: 500 }),
  ],
  update: [
    param('id').isMongoId(),
    body('title').optional().isString().trim().isLength({ min: 1, max: 120 }),
    body('amount').optional().isFloat({ min: 0 }).toFloat(),
    body('type').optional().isIn(['income', 'expense']),
    body('category').optional().isString().trim().isLength({ min: 1, max: 60 }),
    body('frequency').optional().isIn(['weekly', 'monthly', 'yearly']),
    body('nextDueDate').optional().isISO8601(),
    body('note').optional().isString().trim().isLength({ max: 500 }),
  ],
  id: [param('id').isMongoId()],
}

const billValidations = {
  create: [
    body('title').isString().trim().isLength({ min: 1, max: 120 }),
    body('amount').isFloat({ min: 0 }).toFloat(),
    body('dueDate').isISO8601(),
    body('category').optional().isString().trim().isLength({ min: 1, max: 60 }),
    body('isPaid').optional().isBoolean().toBoolean(),
    body('note').optional().isString().trim().isLength({ max: 500 }),
  ],
  update: [
    param('id').isMongoId(),
    body('title').optional().isString().trim().isLength({ min: 1, max: 120 }),
    body('amount').optional().isFloat({ min: 0 }).toFloat(),
    body('dueDate').optional().isISO8601(),
    body('category').optional().isString().trim().isLength({ min: 1, max: 60 }),
    body('isPaid').optional().isBoolean().toBoolean(),
    body('note').optional().isString().trim().isLength({ max: 500 }),
  ],
  id: [param('id').isMongoId()],
}

module.exports = {
  listSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  listRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  listBills,
  createBill,
  updateBill,
  deleteBill,
  savingsValidations,
  recurringValidations,
  billValidations,
}
