import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import toast from 'react-hot-toast'
import { GlassCard } from '../components/ui/GlassCard'
import { Skeleton } from '../components/ui/Skeleton'
import * as analytics from '../services/analytics'
import { exportUrl } from '../services/transactions'

export function AnalyticsPage() {
  const month = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }, [])

  const [loading, setLoading] = useState(true)
  const [charts, setCharts] = useState(null)
  const [insights, setInsights] = useState(null)

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      try {
        const [c, i] = await Promise.all([analytics.getCharts({ month }), analytics.getInsights({ month })])
        if (!alive) return
        setCharts(c)
        setInsights(i)
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load analytics')
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
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-56 md:col-span-2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Advanced Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Spending trends, category analysis, and custom report-ready visuals.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-3 font-semibold">Spending Trends</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.dailyExpenses || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area dataKey="amount" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 font-semibold">Category Analysis</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights?.monthlyBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <div className="font-semibold">Custom Reports & Weekly/Monthly Comparison</div>
          <a
            href={exportUrl({})}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-3 py-2 text-xs font-semibold text-white shadow-glow-sm"
          >
            Export Reports
          </a>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {(insights?.messages || []).map((m) => (
            <motion.div key={m} whileHover={{ y: -2 }} className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/50">
              {m}
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

