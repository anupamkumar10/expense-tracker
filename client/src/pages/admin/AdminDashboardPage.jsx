import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GlassCard } from '../../components/ui/GlassCard'
import { Spinner } from '../../components/ui/Spinner'
import * as adminApi from '../../services/admin'

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      try {
        const res = await adminApi.getAdminStats()
        if (!alive) return
        setStats(res.stats)
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load admin stats')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <GlassCard title="Admin overview">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Spinner /> Loading…
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total users" value={stats?.users ?? 0} />
            <Stat label="Total transactions" value={stats?.transactions ?? 0} />
            <Stat label="Income volume" value={currency(stats?.incomeVolume)} />
            <Stat label="Expense volume" value={currency(stats?.expenseVolume)} />
          </div>
        )}
      </GlassCard>
    </div>
  )
}

function currency(v) {
  const n = Number(v || 0)
  return n.toLocaleString(undefined, { style: 'currency', currency: 'INR' })
}

