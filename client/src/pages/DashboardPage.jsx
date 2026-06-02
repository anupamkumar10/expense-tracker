import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Skeleton } from '../components/ui/Skeleton'
import * as analytics from '../services/analytics'
import * as plannerApi from '../services/planner'

function Stat({ label, value, tone = 'default' }) {
  return (
    <div className={`rounded-xl border p-4 ${tone === 'accent' ? 'border-indigo-300/50 bg-indigo-500/10 dark:border-indigo-400/30' : 'border-white/30 bg-white/40 dark:border-white/10 dark:bg-slate-900/40'} backdrop-blur`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dash, setDash] = useState(null)
  const [insights, setInsights] = useState(null)
  const [charts, setCharts] = useState(null)
  const [savingsGoals, setSavingsGoals] = useState([])

  const month = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }, [])

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      try {
        const [d, i, c, g] = await Promise.all([
          analytics.getDashboard({ month }),
          analytics.getInsights({ month }),
          analytics.getCharts({ month }),
          plannerApi.listSavingsGoals().catch(() => ({ items: [] })),
        ])
        if (!alive) return
        setDash(d)
        setInsights(i)
        setCharts(c)
        setSavingsGoals((g.items || []).slice(0, 3))
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load dashboard')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [month])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 md:col-span-2" />
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    )
  }

  const todaySpend = (dash?.recentTransactions || [])
    .filter((t) => t.type === 'expense' && new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const monthlySpend = Number(insights?.current?.expense || 0)
  const monthlyIncome = Number(insights?.current?.income || 0)
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpend) / monthlyIncome) * 100 : 0
  const budgetUsage = Number(insights?.budget?.percentUsed || 0)
  const healthScore = Math.max(0, Math.min(100, Math.round((savingsRate + (100 - Math.min(budgetUsage, 100))) / 2)))

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="relative overflow-hidden border-indigo-300/30 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="relative">
            <div className="text-sm font-semibold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">Welcome back</div>
            <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{user?.name}, your money is moving smarter today.</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Track, compare, and optimize with real-time financial intelligence.</p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Today's spending" value={currency(todaySpend)} />
        <Stat label="Monthly spending" value={currency(monthlySpend)} />
        <Stat label="Savings rate" value={`${savingsRate.toFixed(1)}%`} tone="accent" />
        <Stat label="Financial health score" value={`${healthScore}/100`} tone="accent" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Total balance" value={currency(dash?.totals?.balance)} />
        <Stat label="Total income" value={currency(dash?.totals?.income)} />
        <Stat label="Total expenses" value={currency(dash?.totals?.expense)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold">Budget status</div>
            {insights?.budget?.warning ? (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-400/20 dark:text-amber-200">
                {insights.budget.warning}
              </span>
            ) : null}
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${Math.min(100, budgetUsage)}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{budgetUsage.toFixed(1)}% of monthly budget used</p>
          <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {(insights?.messages || []).slice(0, 2).map((m) => (
              <div key={m} className="rounded-lg border border-slate-200/60 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                {m}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-1">
          <div className="mb-3 font-semibold">Income vs Expense</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.incomeVsExpense || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-1">
          <div className="mb-3 font-semibold">Category Heatmap</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={charts?.categoryPie || []} dataKey="value" nameKey="name" outerRadius={85} fill="#0f172a" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-3 font-semibold">Transaction Timeline</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2">Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th className="text-right">Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {(dash?.recentTransactions || []).map((t) => (
                  <tr key={t._id} className="border-t border-slate-200/70 dark:border-slate-800">
                    <td className="py-2">{formatDate(t.date)}</td>
                    <td className={t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>{t.type}</td>
                    <td>{t.category}</td>
                    <td className="text-right font-medium">{currency(t.amount)}</td>
                    <td className="text-slate-500 dark:text-slate-400">{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 font-semibold">Savings Goals</div>
          {savingsGoals.length === 0 ? (
            <p className="text-sm text-slate-500">Add goals in Planner to track progress here.</p>
          ) : (
            savingsGoals.map((g) => {
              const pct = g.targetAmount ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0
              return (
                <div key={g._id} className="mb-3 rounded-lg border border-slate-200/70 p-3 dark:border-slate-800">
                  <div className="text-sm font-medium">{g.name}</div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{pct}% · {currency(g.currentAmount)} / {currency(g.targetAmount)}</div>
                </div>
              )
            })
          )}
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-3 font-semibold">User Profile Widget</div>
        <div className="overflow-x-auto">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/70 p-3 dark:border-slate-800">
              <div className="text-xs text-slate-500">User</div>
              <div className="font-semibold">{user?.name}</div>
            </div>
            <div className="rounded-xl border border-slate-200/70 p-3 dark:border-slate-800">
              <div className="text-xs text-slate-500">Role</div>
              <div className="font-semibold capitalize">{user?.role}</div>
            </div>
            <div className="rounded-xl border border-slate-200/70 p-3 dark:border-slate-800">
              <div className="text-xs text-slate-500">Monthly compare</div>
              <div className="font-semibold">
                {Number(insights?.current?.expense || 0) >= Number(insights?.previous?.expense || 0) ? 'Uptrend' : 'Downtrend'}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

function currency(v) {
  const n = Number(v || 0)
  return n.toLocaleString(undefined, { style: 'currency', currency: 'INR' })
}

function formatDate(d) {
  const dt = new Date(d)
  return dt.toLocaleDateString()
}

