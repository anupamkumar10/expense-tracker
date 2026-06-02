import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GlassCard } from '../components/ui/GlassCard'
import { Spinner } from '../components/ui/Spinner'
import { useTheme } from '../context/ThemeContext'
import * as budgetApi from '../services/budget'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      try {
        const res = await budgetApi.getBudget()
        if (!alive) return
        setMonthlyLimit(res.budget?.monthlyLimit ?? '')
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load settings')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [])

  async function onSaveBudget() {
    setSaving(true)
    try {
      const n = Number(monthlyLimit || 0)
      const res = await budgetApi.setBudget(n)
      setMonthlyLimit(res.budget.monthlyLimit)
      toast.success('Budget saved')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save budget')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard title="Appearance">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Theme</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Current: {theme}</div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800"
          >
            Toggle
          </button>
        </div>
      </GlassCard>

      <GlassCard title="Monthly budget">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Spinner /> Loading…
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[240px]">
              <label className="text-sm font-medium">Limit (INR)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                type="number"
                min="0"
                step="0.01"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
              />
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={onSaveBudget}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
            >
              {saving ? <Spinner /> : null}
              Save
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  )
}

