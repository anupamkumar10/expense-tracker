import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Spinner } from '../../components/ui/Spinner'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/app/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your premium finance workspace.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-200">Email</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none ring-brand-500/50 focus:ring-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-200">Password</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2.5 text-sm text-white outline-none ring-brand-500/50 focus:ring-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="btn-primary flex w-full items-center justify-center gap-2"
        >
          {loading ? <Spinner className="border-white/30 border-t-white" /> : null}
          Sign in
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        New here?{' '}
        <Link className="font-semibold text-brand-300 hover:text-brand-200" to="/register">
          Create account
        </Link>
      </p>
    </AuthLayout>
  )
}
