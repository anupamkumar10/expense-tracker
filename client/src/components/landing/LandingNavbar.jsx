import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#product', label: 'Product' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function LandingNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-glow">
            SE
          </span>
          <span className="font-semibold tracking-tight text-white">
            Smart<span className="text-brand-300">Expense</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-slate-300 transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-slate-200">
                {l.label}
              </a>
            ))}
            <Link to="/login" className="text-sm text-slate-200" onClick={() => setOpen(false)}>
              Sign in
            </Link>
            <Link to="/register" className={cn('btn-primary text-center text-sm')} onClick={() => setOpen(false)}>
              Get started
            </Link>
          </div>
        </div>
      ) : null}
    </motion.header>
  )
}
