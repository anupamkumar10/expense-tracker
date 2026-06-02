import { Link } from 'react-router-dom'

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="container-page relative flex min-h-screen flex-col justify-center py-12">
        <Link to="/" className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-slate-300 transition hover:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold">
            SE
          </span>
          Back to home
        </Link>

        <div className="mx-auto w-full max-w-md">
          <div className="glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl md:p-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
