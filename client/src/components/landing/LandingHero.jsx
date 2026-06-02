import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedCounter } from './AnimatedCounter'
import { heroStats } from './landingData'

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            Production-grade full-stack expense intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl"
          >
            Master your money with a{' '}
            <span className="bg-gradient-to-r from-brand-300 via-white to-emerald-300 bg-clip-text text-transparent">
              premium finance OS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-xl text-lg text-slate-300"
          >
            Track spending, plan budgets, compare trends, and unlock recruiter-grade dashboards — built with React, Node,
            MongoDB, and real JWT security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/register" className="btn-primary">
              Get started free
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign in
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 grid gap-3 sm:grid-cols-3"
          >
            {heroStats.map((s) => (
              <div key={s.label} className="glass-panel rounded-2xl p-4">
                <div className="text-2xl font-bold text-white md:text-3xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-500/40 to-emerald-500/30 blur-2xl" />
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/20 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Live dashboard preview</div>
              <div className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Balance', value: '₹1,24,500', tone: 'text-white' },
                { label: 'Monthly spend', value: '₹42,180', tone: 'text-rose-300' },
                { label: 'Savings rate', value: '28.4%', tone: 'text-emerald-300' },
                { label: 'Health score', value: '86/100', tone: 'text-brand-300' },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <div className="text-xs text-slate-400">{c.label}</div>
                  <div className={`mt-1 text-lg font-semibold ${c.tone}`}>{c.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 h-28 rounded-xl border border-white/10 bg-gradient-to-r from-brand-500/20 via-transparent to-emerald-500/20 p-3">
              <div className="flex h-full items-end gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-brand-500 to-brand-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
              Insight: You spent 22% more on Travel this month compared to last month.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
