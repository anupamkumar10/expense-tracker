const { query } = require('express-validator')
const { Transaction } = require('../models/Transaction')
const { Budget } = require('../models/Budget')
const { asyncHandler } = require('../utils/asyncHandler')

function monthRange(yyyyMm) {
  const [y, m] = yyyyMm.split('-').map((v) => Number(v))
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0))
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0))
  return { start, end }
}

function fmtMonth(date) {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

const dashboard = asyncHandler(async (req, res) => {
  const now = new Date()
  const month = req.query.month || fmtMonth(now)
  const { start, end } = monthRange(month)

  const [summary, recent] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]),
    Transaction.find({ userId: req.user._id }).sort({ date: -1, _id: -1 }).limit(8),
  ])

  let incomeTotal = 0
  let expenseTotal = 0
  for (const row of summary) {
    if (row._id === 'income') incomeTotal = row.total
    if (row._id === 'expense') expenseTotal = row.total
  }

  const monthAgg = await Transaction.aggregate([
    { $match: { userId: req.user._id, date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ])
  let monthIncome = 0
  let monthExpense = 0
  for (const row of monthAgg) {
    if (row._id === 'income') monthIncome = row.total
    if (row._id === 'expense') monthExpense = row.total
  }

  res.json({
    success: true,
    totals: {
      balance: incomeTotal - expenseTotal,
      income: incomeTotal,
      expense: expenseTotal,
    },
    month: {
      month,
      income: monthIncome,
      expense: monthExpense,
      balance: monthIncome - monthExpense,
    },
    recentTransactions: recent,
  })
})

const insights = asyncHandler(async (req, res) => {
  const now = new Date()
  const currentMonth = req.query.month || fmtMonth(now)
  const { start: curStart, end: curEnd } = monthRange(currentMonth)
  const prevDate = new Date(Date.UTC(curStart.getUTCFullYear(), curStart.getUTCMonth() - 1, 1))
  const prevMonth = fmtMonth(prevDate)
  const { start: prevStart, end: prevEnd } = monthRange(prevMonth)

  const [curByCategory, prevByCategory, curTotals, prevTotals, budget] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: 'expense', date: { $gte: curStart, $lt: curEnd } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: 'expense', date: { $gte: prevStart, $lt: prevEnd } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, date: { $gte: curStart, $lt: curEnd } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, date: { $gte: prevStart, $lt: prevEnd } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    Budget.findOne({ userId: req.user._id }),
  ])

  function totalsMap(rows) {
    let income = 0
    let expense = 0
    for (const r of rows) {
      if (r._id === 'income') income = r.total
      if (r._id === 'expense') expense = r.total
    }
    return { income, expense, balance: income - expense }
  }

  const cur = totalsMap(curTotals)
  const prev = totalsMap(prevTotals)

  const expenseDelta = cur.expense - prev.expense
  const expensePct = prev.expense > 0 ? (expenseDelta / prev.expense) * 100 : null

  const prevCatMap = new Map(prevByCategory.map((r) => [r._id, r.total]))
  const highestCategory = curByCategory[0] ? { category: curByCategory[0]._id, total: curByCategory[0].total } : null

  const messages = []
  if (expensePct !== null) {
    const dir = expensePct >= 0 ? 'more' : 'less'
    messages.push(`You spent ${Math.abs(expensePct).toFixed(1)}% ${dir} overall this month compared to last month.`)
  } else {
    messages.push('No previous month expenses to compare yet.')
  }

  if (highestCategory) {
    const prevCat = prevCatMap.get(highestCategory.category) || 0
    const catDelta = highestCategory.total - prevCat
    const catPct = prevCat > 0 ? (catDelta / prevCat) * 100 : null
    if (catPct !== null) {
      const dir = catPct >= 0 ? 'more' : 'less'
      messages.push(
        `You spent ${Math.abs(catPct).toFixed(1)}% ${dir} on ${highestCategory.category} this month compared to last month.`,
      )
    } else {
      messages.push(`Highest spending category this month: ${highestCategory.category}.`)
    }
  }

  let budgetStatus = null
  if (budget?.monthlyLimit != null) {
    const pct = budget.monthlyLimit > 0 ? (cur.expense / budget.monthlyLimit) * 100 : 0
    const crossed80 = pct >= 80
    const crossed100 = pct >= 100
    budgetStatus = {
      monthlyLimit: budget.monthlyLimit,
      spent: cur.expense,
      percentUsed: Number.isFinite(pct) ? pct : 0,
      warning: crossed100 ? 'Budget exceeded' : crossed80 ? 'Budget at 80%+' : null,
    }
    if (budgetStatus.warning) messages.push(budgetStatus.warning)
  }

  const monthlyBreakdown = curByCategory.map((r) => ({ category: r._id, total: r.total }))

  res.json({
    success: true,
    month: currentMonth,
    previousMonth: prevMonth,
    current: cur,
    previous: prev,
    highestCategory,
    monthlyBreakdown,
    budget: budgetStatus,
    messages,
  })
})

const charts = asyncHandler(async (req, res) => {
  const now = new Date()
  const month = req.query.month || fmtMonth(now)
  const { start, end } = monthRange(month)

  const [byCategory, byDay, incomeVsExpense] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Transaction.aggregate([
      { $match: { userId: req.user._id, date: { $gte: start, $lt: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
  ])

  let income = 0
  let expense = 0
  for (const r of incomeVsExpense) {
    if (r._id === 'income') income = r.total
    if (r._id === 'expense') expense = r.total
  }

  res.json({
    success: true,
    month,
    categoryPie: byCategory.map((r) => ({ name: r._id, value: r.total })),
    dailyExpenses: byDay.map((r) => ({ date: r._id, amount: r.total })),
    incomeVsExpense: [
      { name: 'Income', value: income },
      { name: 'Expense', value: expense },
    ],
  })
})

const validations = {
  monthQuery: [query('month').optional().matches(/^\d{4}-\d{2}$/)],
}

module.exports = { dashboard, insights, charts, validations }

