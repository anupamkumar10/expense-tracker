const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ['income', 'expense'], index: true },
    category: { type: String, required: true, trim: true, maxlength: 60, index: true },
    note: { type: String, trim: true, maxlength: 500, default: '' },
    date: { type: Date, required: true, index: true },
  },
  { timestamps: true },
)

transactionSchema.index({ userId: 1, date: -1 })

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = { Transaction }

