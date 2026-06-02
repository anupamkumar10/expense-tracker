import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { GlassCard } from '../../components/ui/GlassCard'
import { Pagination } from '../../components/ui/Pagination'
import { Spinner } from '../../components/ui/Spinner'
import * as adminApi from '../../services/admin'

function useDebounced(value, delayMs) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return v
}

export function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [q, setQ] = useState('')
  const qd = useDebounced(q, 350)

  const params = useMemo(() => ({ page, limit, q: qd || undefined }), [page, limit, qd])
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ users: [], pagination: { page: 1, pages: 1 } })

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      try {
        const res = await adminApi.listUsers(params)
        if (!alive) return
        setData(res)
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load users')
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
    const snapshot = data.users
    setData((d) => ({ ...d, users: d.users.filter((u) => u.id !== id) }))
    try {
      await adminApi.deleteUser(id)
      toast.success('User deleted')
    } catch (err) {
      setData((d) => ({ ...d, users: snapshot }))
      toast.error(err?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard
        title="Users"
        action={
          <input
            className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            value={q}
            placeholder="Search name/email…"
            onChange={(e) => {
              setPage(1)
              setQ(e.target.value)
            }}
          />
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
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-2">{u.name}</td>
                    <td className="text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td>{u.role}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-800"
                        onClick={() => onDelete(u.id)}
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

