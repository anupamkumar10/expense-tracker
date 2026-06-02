import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  extraFeatures,
  faqs,
  featureCards,
  productScreens,
  testimonials,
} from './landingData'
import {
  AnalyticsScreenshot,
  DashboardScreenshot,
  PlannerScreenshot,
  TransactionsScreenshot,
} from './ProductScreenshotMocks'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.45 },
}

export function LandingFeatures() {
  return (
    <section id="features" className="border-t border-white/10 py-20">
      <div className="container-page">
        <motion.div {...fadeUp}>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">Features</p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Everything you need to run personal finance like a startup</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Built for speed, clarity, and portfolio impact — with real backend APIs powering every screen.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-panel group rounded-2xl p-5 transition-shadow hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{f.icon}</span>
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-200">
                  {f.tag}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-8 flex flex-wrap gap-2">
          {extraFeatures.map((x) => (
            <span key={x} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {x}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const screenshotMap = {
  dashboard: DashboardScreenshot,
  transactions: TransactionsScreenshot,
  planner: PlannerScreenshot,
  analytics: AnalyticsScreenshot,
}

export function LandingProduct() {
  return (
    <section id="product" className="border-t border-white/10 py-20">
      <div className="container-page">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Product screenshots</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Realistic previews of the actual app — dashboard, transactions, planner, and analytics.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {productScreens.map((s, i) => {
            const Shot = screenshotMap[s.component]
            return (
              <motion.div
                key={s.title}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-200">
                    Live UI
                  </span>
                </div>
                <Shot />
                <p className="mt-4 text-sm text-slate-400">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function LandingWhyUs() {
  const items = [
    { title: 'Recruiter-ready polish', desc: 'Premium UI comparable to Stripe, Linear, and modern fintech SaaS.' },
    { title: 'Real engineering depth', desc: 'JWT auth, MVC backend, MongoDB, validation, and role-based admin APIs.' },
    { title: 'Actionable intelligence', desc: 'Insights and charts that help users decide — not just display numbers.' },
  ]

  return (
    <section className="border-t border-white/10 py-20">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-bold text-white">Why teams choose Smart Expense</h2>
          <p className="mt-3 text-slate-400">
            Designed to impress in interviews, demos, and production deployments — without sacrificing clean architecture.
          </p>
        </motion.div>
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.06 }} className="glass-panel rounded-2xl p-5">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingTestimonials() {
  return (
    <section className="border-t border-white/10 py-20">
      <div className="container-page">
        <motion.h2 {...fadeUp} className="text-3xl font-bold text-white">
          Loved by builders and reviewers
        </motion.h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote key={t.name} {...fadeUp} transition={{ delay: i * 0.06 }} className="glass-panel rounded-2xl p-6">
              <p className="text-slate-200">“{t.quote}”</p>
              <footer className="mt-4 text-sm">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-slate-400">{t.role}</div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingFAQ() {
  return (
    <section id="faq" className="border-t border-white/10 py-20">
      <div className="container-page max-w-3xl">
        <motion.h2 {...fadeUp} className="text-3xl font-bold text-white">
          Frequently asked questions
        </motion.h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <motion.details key={f.q} {...fadeUp} transition={{ delay: i * 0.04 }} className="glass-panel group rounded-xl p-4">
              <summary className="cursor-pointer list-none font-semibold text-white marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {f.q}
                  <span className="text-brand-300 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingCTA() {
  return (
    <section className="border-t border-white/10 py-20">
      <div className="container-page">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl border border-brand-400/30 bg-gradient-to-r from-brand-600/30 via-slate-900 to-emerald-600/20 p-10 text-center"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to impress recruiters and users?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              Launch your account in under a minute and explore dashboards, analytics, planner tools, and secure admin workflows.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-primary">
                Create free account
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container-page grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold">SE</span>
            <span className="font-semibold text-white">Smart Expense Tracker</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            Premium full-stack expense intelligence for individuals, builders, and teams.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Product</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <a href="#features">Features</a>
            <a href="#product">Product</a>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Stack</div>
          <div className="mt-3 text-sm text-slate-300">React · Node · MongoDB · JWT</div>
        </div>
      </div>
      <div className="container-page mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Smart Expense Tracker. Built for production-grade portfolio impact.
      </div>
    </footer>
  )
}
