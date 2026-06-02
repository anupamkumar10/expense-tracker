const mongoose = require('mongoose')

const recurringTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
    nextDueDate: { type: Date, required: true },
    note: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
)

const RecurringTransaction = mongoose.model('RecurringTransaction', recurringTransactionSchema)

module.exports = { RecurringTransaction }
