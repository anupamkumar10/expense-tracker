const mongoose = require('mongoose')

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    savingsType: {
      type: String,
      enum: ['emergency', 'vacation', 'investment', 'education', 'other'],
      default: 'other',
    },
    targetAmount: { type: Number, required: true, min: 0 },
    currentAmount: { type: Number, default: 0, min: 0 },
    targetDate: { type: Date, required: true },
    note: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
)

const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema)

module.exports = { SavingsGoal }
