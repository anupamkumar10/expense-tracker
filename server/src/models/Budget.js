const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    monthlyLimit: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
)

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = { Budget }

