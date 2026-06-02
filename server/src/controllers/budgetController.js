const { body } = require('express-validator')
const { Budget } = require('../models/Budget')
const { asyncHandler } = require('../utils/asyncHandler')

const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({ userId: req.user._id })
  res.json({ success: true, budget })
})

const upsertBudget = asyncHandler(async (req, res) => {
  const { monthlyLimit } = req.body
  const budget = await Budget.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { monthlyLimit } },
    { upsert: true, new: true },
  )
  res.json({ success: true, budget })
})

const validations = {
  upsert: [body('monthlyLimit').isFloat({ min: 0 }).toFloat()],
}

module.exports = { getBudget, upsertBudget, validations }

