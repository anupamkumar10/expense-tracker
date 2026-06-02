const mongoose = require('mongoose')

const upcomingBillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    category: { type: String, trim: true, maxlength: 60, default: 'Bills' },
    isPaid: { type: Boolean, default: false },
    note: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
)

const UpcomingBill = mongoose.model('UpcomingBill', upcomingBillSchema)

module.exports = { UpcomingBill }
