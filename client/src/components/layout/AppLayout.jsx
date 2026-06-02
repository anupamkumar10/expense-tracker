import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/cn'

const nav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: '◆', end: true },
  { to: '/app/transactions', label: 'Transactions', icon: '⇄' },
  { to: '/app/analytics', label: 'Analytics', icon: '◎' },
  { to: '/app/planner', label: 'Planner', icon: '▣' },
  { to: '/app/settings', label: 'Settings', icon: '⚙' },
]

const adminNav = [
  { to: '/app/admin/dashboard', label: 'Overview', icon: '★' },
  { to: '/app/admin/users', label: 'Users', icon: '👤' },
  { to: '/app/admin/transactions', label: 'All Transactions', icon: '≡' },
]

function NavItem({ to, children, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(isActive ? 'sidebar-link-active' : 'sidebar-link')
      }
    >
      <span className="text-xs opacity-80">{icon}</span>
      {children}
    </NavLink>
  )
}

export function AppLayout() {
  const { user, logout, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (!profileRef.current) return
      if (!profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    window.addEventListener('click', onClickOutside)
    return () => window.removeEventListener('click', onClickOutside)
  }, [])

  return (
    <div className="app-shell-bg">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Link to="/app/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-glow-sm">
              SE
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">Smart Expense</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Finance workspace</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setProfileOpen((v) => !v)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-900"
                aria-label="Open profile menu"
              >
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </button>
              {profileOpen ? (
                <div className="absolute right-0 z-40 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                  <div className="rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-900/60">
                    <div className="text-sm font-semibold">{user?.name}</div>
                    <div className="truncate text-xs text-slate-500">{user?.email}</div>
                    <div className="mt-1 inline-flex rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-600 dark:text-brand-300">
                      {user?.role}
                    </div>
                  </div>
                  <Link
                    to="/app/settings"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    Profile & Settings
                  </Link>
                  {isAdmin ? (
                    <Link
                      to="/app/admin/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                      Admin Dashboard
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      logout()
                    }}
                    className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="container-page grid grid-cols-1 gap-6 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon} end={item.end}>
                {item.label}
              </NavItem>
            ))}
            {isAdmin ? (
              <>
                <div className="mt-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin</div>
                {adminNav.map((item) => (
                  <NavItem key={item.to} to={item.to} icon={item.icon}>
                    {item.label}
                  </NavItem>
                ))}
              </>
            ) : null}
          </nav>

          <div className="mt-6 rounded-xl border border-dashed border-brand-300/40 bg-brand-500/5 p-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="font-semibold text-brand-700 dark:text-brand-300">Pro tip</div>
            <p className="mt-1">Use Analytics + Planner together to improve savings rate faster.</p>
          </div>
        </aside>

        <main className="min-w-0 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
