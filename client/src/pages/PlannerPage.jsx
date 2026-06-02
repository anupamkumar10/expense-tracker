import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GlassCard } from '../components/ui/GlassCard'
import { Modal } from '../components/ui/Modal'
import { Skeleton } from '../components/ui/Skeleton'
import { Spinner } from '../components/ui/Spinner'
import * as plannerApi from '../services/planner'

const SAVINGS_TYPES = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'investment', label: 'Investment' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
]

const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

const CATEGORIES = ['Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Health', 'Salary', 'Freelance', 'Other']

function toIsoDate(dateStr) {
  if (!dateStr) return undefined
  return dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00.000Z`
}

function formatDate(d) {
  return new Date(d).toLocaleDateString()
}

function currency(v) {
  return Number(v || 0).toLocaleString(undefined, { style: 'currency', currency: 'INR' })
}

function progressPct(current, target) {
  if (!target) return 0
  return Math.min(100, Math.round((Number(current) / Number(target)) * 100))
}

export function PlannerPage() {
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState([])
  const [recurring, setRecurring] = useState([])
  const [bills, setBills] = useState([])

  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [g, r, b] = await Promise.all([
        plannerApi.listSavingsGoals(),
        plannerApi.listRecurring(),
        plannerApi.listBills(),
      ])
      setGoals(g.items || [])
      setRecurring(r.items || [])
      setBills(b.items || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load planner data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openCreate(type) {
    setEditing(null)
    setModal(type)
  }

  function openEdit(type, item) {
    setEditing(item)
    setModal(type)
  }

  function closeModal() {
    setModal(null)
    setEditing(null)
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64 md:col-span-2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financial Planner</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manually create and manage your savings goals, recurring transactions, and upcoming bills.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard
          title="Savings Goals"
          action={
            <button type="button" onClick={() => openCreate('goal')} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white">
              + Add goal
            </button>
          }
        >
          {goals.length === 0 ? (
            <p className="text-sm text-slate-500">No goals yet. Add your first savings target.</p>
          ) : (
            <div className="space-y-3">
              {goals.map((g) => {
                const pct = progressPct(g.currentAmount, g.targetAmount)
                return (
                  <div key={g._id} className="rounded-xl border border-slate-200/70 p-3 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{g.name}</div>
                        <div className="text-xs capitalize text-slate-500">
                          {g.savingsType} · Target {formatDate(g.targetDate)}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" className="text-xs text-brand-600" onClick={() => openEdit('goal', g)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-xs text-rose-600"
                          onClick={async () => {
                            try {
                              await plannerApi.deleteSavingsGoal(g._id)
                              setGoals((prev) => prev.filter((x) => x._id !== g._id))
                              toast.success('Goal deleted')
                            } catch (err) {
                              toast.error(err?.response?.data?.message || 'Delete failed')
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>{currency(g.currentAmount)} saved</span>
                      <span className="text-slate-500">of {currency(g.targetAmount)}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{pct}% complete</div>
                    {g.note ? <p className="mt-2 text-xs text-slate-500">{g.note}</p> : null}
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>

        <GlassCard
          title="Recurring Transactions"
          action={
            <button type="button" onClick={() => openCreate('recurring')} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white">
              + Add recurring
            </button>
          }
        >
          {recurring.length === 0 ? (
            <p className="text-sm text-slate-500">No recurring items. Add rent, subscriptions, salary, etc.</p>
          ) : (
            <div className="space-y-2">
              {recurring.map((r) => (
                <div key={r._id} className="flex items-center justify-between rounded-lg border border-slate-200/70 px-3 py-2 dark:border-slate-800">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-slate-500">
                      {r.frequency} · {r.category} · {r.type} · Next {formatDate(r.nextDueDate)}
                    </div>
                    {r.note ? <div className="text-xs text-slate-400">{r.note}</div> : null}
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${r.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {currency(r.amount)}
                    </div>
                    <div className="mt-1 flex justify-end gap-2">
                      <button type="button" className="text-xs text-brand-600" onClick={() => openEdit('recurring', r)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-xs text-rose-600"
                        onClick={async () => {
                          try {
                            await plannerApi.deleteRecurring(r._id)
                            setRecurring((prev) => prev.filter((x) => x._id !== r._id))
                            toast.success('Deleted')
                          } catch (err) {
                            toast.error(err?.response?.data?.message || 'Delete failed')
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard
        title="Upcoming Bills"
        action={
          <button type="button" onClick={() => openCreate('bill')} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white">
            + Add bill
          </button>
        }
      >
        {bills.length === 0 ? (
          <p className="text-sm text-slate-500">No bills scheduled. Add due dates and amounts manually.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {bills.map((b) => (
              <div
                key={b._id}
                className={`rounded-xl border px-3 py-3 ${b.isPaid ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-200/70 dark:border-slate-800'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{b.title}</div>
                    <div className="text-xs text-slate-500">
                      Due {formatDate(b.dueDate)} · {b.category}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${b.isPaid ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-700'}`}
                  >
                    {b.isPaid ? 'Paid' : 'Due'}
                  </span>
                </div>
                <div className="mt-2 text-lg font-semibold">{currency(b.amount)}</div>
                {b.note ? <p className="mt-1 text-xs text-slate-500">{b.note}</p> : null}
                <div className="mt-2 flex gap-2">
                  <button type="button" className="text-xs text-brand-600" onClick={() => openEdit('bill', b)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-xs text-rose-600"
                    onClick={async () => {
                      try {
                        await plannerApi.deleteBill(b._id)
                        setBills((prev) => prev.filter((x) => x._id !== b._id))
                        toast.success('Bill deleted')
                      } catch (err) {
                        toast.error(err?.response?.data?.message || 'Delete failed')
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {modal === 'goal' ? (
        <GoalModal
          key={editing?._id || 'goal-new'}
          editing={editing}
          saving={saving}
          onClose={closeModal}
          onSave={async (payload) => {
            setSaving(true)
            try {
              if (editing?._id) {
                const res = await plannerApi.updateSavingsGoal(editing._id, payload)
                setGoals((prev) => prev.map((x) => (x._id === editing._id ? res.item : x)))
                toast.success('Goal updated')
              } else {
                const res = await plannerApi.createSavingsGoal(payload)
                setGoals((prev) => [res.item, ...prev])
                toast.success('Goal created')
              }
              closeModal()
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Save failed')
            } finally {
              setSaving(false)
            }
          }}
        />
      ) : null}

      {modal === 'recurring' ? (
        <RecurringModal
          key={editing?._id || 'recurring-new'}
          editing={editing}
          saving={saving}
          onClose={closeModal}
          onSave={async (payload) => {
            setSaving(true)
            try {
              if (editing?._id) {
                const res = await plannerApi.updateRecurring(editing._id, payload)
                setRecurring((prev) => prev.map((x) => (x._id === editing._id ? res.item : x)))
                toast.success('Updated')
              } else {
                const res = await plannerApi.createRecurring(payload)
                setRecurring((prev) => [res.item, ...prev])
                toast.success('Created')
              }
              closeModal()
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Save failed')
            } finally {
              setSaving(false)
            }
          }}
        />
      ) : null}

      {modal === 'bill' ? (
        <BillModal
          key={editing?._id || 'bill-new'}
          editing={editing}
          saving={saving}
          onClose={closeModal}
          onSave={async (payload) => {
            setSaving(true)
            try {
              if (editing?._id) {
                const res = await plannerApi.updateBill(editing._id, payload)
                setBills((prev) => prev.map((x) => (x._id === editing._id ? res.item : x)))
                toast.success('Bill updated')
              } else {
                const res = await plannerApi.createBill(payload)
                setBills((prev) => [res.item, ...prev])
                toast.success('Bill added')
              }
              closeModal()
            } catch (err) {
              toast.error(err?.response?.data?.message || 'Save failed')
            } finally {
              setSaving(false)
            }
          }}
        />
      ) : null}
    </div>
  )
}

function GoalModal({ editing, saving, onClose, onSave }) {
  const [name, setName] = useState(editing?.name || '')
  const [savingsType, setSavingsType] = useState(editing?.savingsType || 'emergency')
  const [targetAmount, setTargetAmount] = useState(editing?.targetAmount ?? '')
  const [currentAmount, setCurrentAmount] = useState(editing?.currentAmount ?? '')
  const [targetDate, setTargetDate] = useState(editing?.targetDate ? editing.targetDate.slice(0, 10) : '')
  const [note, setNote] = useState(editing?.note || '')

  return (
    <Modal
      open
      title={editing?._id ? 'Edit savings goal' : 'Add savings goal'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700">
            Cancel
          </button>
          <button
            type="submit"
            form="goal-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
          >
            {saving ? <Spinner className="border-white/30 border-t-white" /> : null}
            Save
          </button>
        </>
      }
    >
      <form
        id="goal-form"
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            name,
            savingsType,
            targetAmount: Number(targetAmount),
            currentAmount: Number(currentAmount || 0),
            targetDate: toIsoDate(targetDate),
            note,
          })
        }}
      >
        <Field label="Goal name" value={name} onChange={setName} required />
        <div>
          <label className="text-sm font-medium">Savings type</label>
          <select className="field-input mt-1" value={savingsType} onChange={(e) => setSavingsType(e.target.value)}>
            {SAVINGS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Target amount" type="number" min="0" step="0.01" value={targetAmount} onChange={setTargetAmount} required />
          <Field label="Saved so far" type="number" min="0" step="0.01" value={currentAmount} onChange={setCurrentAmount} />
        </div>
        <Field label="Target date" type="date" value={targetDate} onChange={setTargetDate} required />
        <Field label="Note" value={note} onChange={setNote} multiline />
      </form>
    </Modal>
  )
}

function RecurringModal({ editing, saving, onClose, onSave }) {
  const [title, setTitle] = useState(editing?.title || '')
  const [amount, setAmount] = useState(editing?.amount ?? '')
  const [type, setType] = useState(editing?.type || 'expense')
  const [category, setCategory] = useState(editing?.category || 'Other')
  const [frequency, setFrequency] = useState(editing?.frequency || 'monthly')
  const [nextDueDate, setNextDueDate] = useState(editing?.nextDueDate ? editing.nextDueDate.slice(0, 10) : '')
  const [note, setNote] = useState(editing?.note || '')

  return (
    <Modal
      open
      title={editing?._id ? 'Edit recurring transaction' : 'Add recurring transaction'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700">
            Cancel
          </button>
          <button type="submit" form="recurring-form" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">
            {saving ? <Spinner className="border-white/30 border-t-white" /> : null}
            Save
          </button>
        </>
      }
    >
      <form
        id="recurring-form"
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            title,
            amount: Number(amount),
            type,
            category,
            frequency,
            nextDueDate: toIsoDate(nextDueDate),
            note,
          })
        }}
      >
        <Field label="Title" value={title} onChange={setTitle} required />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount" type="number" min="0" step="0.01" value={amount} onChange={setAmount} required />
          <div>
            <label className="text-sm font-medium">Type</label>
            <select className="field-input mt-1" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select className="field-input mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Frequency</label>
            <select className="field-input mt-1" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Field label="Next due date" type="date" value={nextDueDate} onChange={setNextDueDate} required />
        <Field label="Note" value={note} onChange={setNote} multiline />
      </form>
    </Modal>
  )
}

function BillModal({ editing, saving, onClose, onSave }) {
  const [title, setTitle] = useState(editing?.title || '')
  const [amount, setAmount] = useState(editing?.amount ?? '')
  const [dueDate, setDueDate] = useState(editing?.dueDate ? editing.dueDate.slice(0, 10) : '')
  const [category, setCategory] = useState(editing?.category || 'Bills')
  const [isPaid, setIsPaid] = useState(editing?.isPaid || false)
  const [note, setNote] = useState(editing?.note || '')

  return (
    <Modal
      open
      title={editing?._id ? 'Edit bill' : 'Add upcoming bill'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700">
            Cancel
          </button>
          <button type="submit" form="bill-form" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">
            {saving ? <Spinner className="border-white/30 border-t-white" /> : null}
            Save
          </button>
        </>
      }
    >
      <form
        id="bill-form"
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            title,
            amount: Number(amount),
            dueDate: toIsoDate(dueDate),
            category,
            isPaid,
            note,
          })
        }}
      >
        <Field label="Bill title" value={title} onChange={setTitle} required />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount" type="number" min="0" step="0.01" value={amount} onChange={setAmount} required />
          <Field label="Due date" type="date" value={dueDate} onChange={setDueDate} required />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <select className="field-input mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
          Mark as paid
        </label>
        <Field label="Note" value={note} onChange={setNote} multiline />
      </form>
    </Modal>
  )
}

function Field({ label, value, onChange, type = 'text', required, multiline, min, step }) {
  const className = 'field-input mt-1 w-full'
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {multiline ? (
        <textarea className={className} rows={2} value={value} onChange={(e) => onChange(e.target.value)} maxLength={500} />
      ) : (
        <input
          className={className}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          min={min}
          step={step}
        />
      )}
    </div>
  )
}
