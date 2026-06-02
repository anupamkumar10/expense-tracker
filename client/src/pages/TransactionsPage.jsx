import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { GlassCard } from '../components/ui/GlassCard'
import { Modal } from '../components/ui/Modal'
import { Pagination } from '../components/ui/Pagination'
import { Spinner } from '../components/ui/Spinner'
import * as txApi from '../services/transactions'

function useDebounced(value, delayMs) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return v
}

const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Health', 'Salary', 'Freelance', 'Other']

export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [q, setQ] = useState('')
  const qDebounced = useDebounced(q, 350)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ transactions: [], pagination: { page: 1, pages: 1, total: 0, limit: 10 } })
  const [selected, setSelected] = useState(new Set())

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const params = useMemo(
    () => ({
      page,
      limit,
      type: type || undefined,
      category: category || undefined,
      sortBy,
      sortOrder,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      q: qDebounced || undefined,
    }),
    [page, limit, type, category, sortBy, sortOrder, startDate, endDate, qDebounced],
  )

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      try {
        const res = await txApi.listTransactions(params)
        if (!alive) return
        setData(res)
        setSelected(new Set())
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

  function toggleSelected(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function onDelete(id) {
    const snapshot = data.transactions
    setData((d) => ({ ...d, transactions: d.transactions.filter((t) => t._id !== id) }))
    try {
      await txApi.deleteTransaction(id)
      toast.success('Deleted')
    } catch (err) {
      setData((d) => ({ ...d, transactions: snapshot }))
      toast.error(err?.response?.data?.message || 'Delete failed')
    }
  }

  async function onBulkDelete() {
    const ids = Array.from(selected)
    if (ids.length === 0) return
    const snapshot = data.transactions
    setData((d) => ({ ...d, transactions: d.transactions.filter((t) => !selected.has(t._id)) }))
    setSelected(new Set())
    try {
      const res = await txApi.bulkDelete(ids)
      toast.success(`Deleted ${res.deletedCount}`)
    } catch (err) {
      setData((d) => ({ ...d, transactions: snapshot }))
      toast.error(err?.response?.data?.message || 'Bulk delete failed')
    }
  }

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(tx) {
    setEditing(tx)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <GlassCard
        title="Transactions"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <a
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800"
              href={txApi.exportUrl(params)}
              target="_blank"
              rel="noreferrer"
            >
              Export CSV
            </a>
            <button
              type="button"
              onClick={onBulkDelete}
              disabled={selected.size === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-50 dark:border-slate-800"
            >
              Bulk delete
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Add
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Search
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={q}
              onChange={(e) => {
                setPage(1)
                setQ(e.target.value)
              }}
              placeholder="note or category…"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Type
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
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
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Category
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={category}
              onChange={(e) => {
                setPage(1)
                setCategory(e.target.value)
              }}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Date from
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              type="date"
              value={startDate}
              onChange={(e) => {
                setPage(1)
                setStartDate(e.target.value)
              }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Date to
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              type="date"
              value={endDate}
              onChange={(e) => {
                setPage(1)
                setEndDate(e.target.value)
              }}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort: Date</option>
              <option value="amount">Sort: Amount</option>
            </select>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Total: {data?.pagination?.total || 0}</span>
            <select
              className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={limit}
              onChange={(e) => {
                setPage(1)
                setLimit(Number(e.target.value))
              }}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-slate-500 dark:text-slate-400">
              <Spinner /> Loading…
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2">
                    <span className="sr-only">Select</span>
                  </th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th className="text-right">Amount</th>
                  <th>Note</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((t) => (
                  <tr key={t._id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-2">
                      <input type="checkbox" checked={selected.has(t._id)} onChange={() => toggleSelected(t._id)} />
                    </td>
                    <td>{formatDate(t.date)}</td>
                    <td className={t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>{t.type}</td>
                    <td>{t.category}</td>
                    <td className="text-right font-medium">{currency(t.amount)}</td>
                    <td className="text-slate-500 dark:text-slate-400">{t.note}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-800"
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </button>{' '}
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
          )}
        </div>

        <div className="mt-4">
          <Pagination page={data.pagination.page} pages={data.pagination.pages} onPage={setPage} />
        </div>
      </GlassCard>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={(saved) => {
          setModalOpen(false)
          setData((d) => {
            const exists = d.transactions.some((t) => t._id === saved._id)
            const next = exists ? d.transactions.map((t) => (t._id === saved._id ? saved : t)) : [saved, ...d.transactions]
            return { ...d, transactions: next }
          })
        }}
      />
    </div>
  )
}

function TransactionModal({ open, onClose, editing, onSaved }) {
  const [amount, setAmount] = useState(editing?.amount ?? '')
  const [type, setType] = useState(editing?.type ?? 'expense')
  const [category, setCategory] = useState(editing?.category ?? 'Other')
  const [note, setNote] = useState(editing?.note ?? '')
  const [date, setDate] = useState(editing?.date ? editing.date.slice(0, 10) : new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setAmount(editing?.amount ?? '')
    setType(editing?.type ?? 'expense')
    setCategory(editing?.category ?? 'Other')
    setNote(editing?.note ?? '')
    setDate(editing?.date ? editing.date.slice(0, 10) : new Date().toISOString().slice(0, 10))
  }, [editing, open])

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { amount: Number(amount), type, category, note, date }
      const res = editing?._id ? await txApi.updateTransaction(editing._id, payload) : await txApi.createTransaction(payload)
      toast.success(editing?._id ? 'Updated' : 'Added')
      onSaved(res.transaction)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing?._id ? 'Edit transaction' : 'Add transaction'}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
            Cancel
          </button>
          <button
            type="submit"
            form="tx-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
          >
            {saving ? <Spinner /> : null}
            Save
          </button>
        </>
      }
    >
      <form id="tx-form" onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Amount</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Note</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>
      </form>
    </Modal>
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

