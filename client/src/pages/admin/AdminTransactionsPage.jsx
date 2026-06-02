import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { GlassCard } from '../../components/ui/GlassCard'
import { Pagination } from '../../components/ui/Pagination'
import { Spinner } from '../../components/ui/Spinner'
import * as adminApi from '../../services/admin'

export function AdminTransactionsPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [type, setType] = useState('')

  const params = useMemo(() => ({ page, limit, type: type || undefined }), [page, limit, type])
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ transactions: [], pagination: { page: 1, pages: 1 } })

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      try {
        const res = await adminApi.listAllTransactions(params)
        if (!alive) return
        setData(res)
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load transactions')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [params])

  async function onDelete(id) {
    const snapshot = data.transactions
    setData((d) => ({ ...d, transactions: d.transactions.filter((t) => t._id !== id) }))
    try {
      await adminApi.deleteAnyTransaction(id)
      toast.success('Deleted')
    } catch (err) {
      setData((d) => ({ ...d, transactions: snapshot }))
      toast.error(err?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard
        title="All transactions"
        action={
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            value={type}
            onChange={(e) => {
              setPage(1)
              setType(e.target.value)
            }}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        }
      >
        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-slate-500 dark:text-slate-400">
            <Spinner /> Loading…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2">Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((t) => (
                  <tr key={t._id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-2">{formatDate(t.date)}</td>
                    <td className="text-slate-500 dark:text-slate-400">
                      {t.userId?.name} ({t.userId?.email})
                    </td>
                    <td className={t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>{t.type}</td>
                    <td>{t.category}</td>
                    <td className="text-right font-medium">{currency(t.amount)}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-800"
                        onClick={() => onDelete(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <Pagination page={data.pagination.page} pages={data.pagination.pages} onPage={setPage} />
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

