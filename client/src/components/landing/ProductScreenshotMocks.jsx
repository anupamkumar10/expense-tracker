/** Realistic in-app UI mocks for the marketing page (no external image assets). */

function WindowChrome({ title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-slate-900 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/80 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[10px] font-medium text-slate-400">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

export function DashboardScreenshot() {
  return (
    <WindowChrome title="Smart Expense — Dashboard">
      <div className="rounded-lg bg-gradient-to-r from-indigo-600/40 to-emerald-600/30 p-3 text-xs text-white">
        Welcome back, Anupa — your money is moving smarter today.
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {['Balance', 'Spend', 'Savings', 'Health'].map((l, i) => (
          <div key={l} className="rounded-md border border-white/10 bg-slate-800/80 p-2">
            <div className="text-[9px] text-slate-400">{l}</div>
            <div className="text-[11px] font-bold text-white">{['₹1.2L', '₹42K', '28%', '86'][i]}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="h-20 rounded-md border border-white/10 bg-slate-800/60 p-2">
          <div className="text-[9px] text-slate-400">Income vs Expense</div>
          <div className="mt-2 flex h-10 items-end gap-1">
            {[30, 55, 40, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-indigo-400" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="h-20 rounded-md border border-white/10 bg-slate-800/60 p-2">
          <div className="text-[9px] text-slate-400">Categories</div>
          <div className="mt-2 flex justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-indigo-400 border-r-emerald-400 border-b-amber-400" />
          </div>
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {['Travel · expense', 'Salary · income'].map((r) => (
          <div key={r} className="flex justify-between rounded border border-white/5 bg-slate-800/50 px-2 py-1 text-[9px] text-slate-300">
            <span>{r}</span>
            <span className="font-semibold text-white">₹8,200</span>
          </div>
        ))}
      </div>
    </WindowChrome>
  )
}

export function TransactionsScreenshot() {
  return (
    <WindowChrome title="Smart Expense — Transactions">
      <div className="flex gap-2">
        <div className="h-6 flex-1 rounded bg-slate-800/80" />
        <div className="h-6 w-16 rounded bg-indigo-500/80 text-center text-[9px] leading-6 text-white">Add</div>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1 text-[8px] uppercase text-slate-500">
        <span>Date</span>
        <span>Type</span>
        <span>Category</span>
        <span className="text-right">Amount</span>
      </div>
      {[
        { d: 'Jun 02', t: 'expense', c: 'Food', a: '₹850' },
        { d: 'Jun 01', t: 'income', c: 'Salary', a: '₹75,000' },
        { d: 'May 30', t: 'expense', c: 'Travel', a: '₹4,200' },
      ].map((row) => (
        <div key={row.d + row.c} className="mt-1 grid grid-cols-4 gap-1 border-t border-white/5 py-1 text-[9px]">
          <span className="text-slate-400">{row.d}</span>
          <span className={row.t === 'income' ? 'text-emerald-400' : 'text-rose-400'}>{row.t}</span>
          <span className="text-slate-300">{row.c}</span>
          <span className="text-right font-semibold text-white">{row.a}</span>
        </div>
      ))}
      <div className="mt-2 flex justify-between text-[9px] text-slate-500">
        <span>Page 1 of 4</span>
        <span>Export CSV</span>
      </div>
    </WindowChrome>
  )
}

export function PlannerScreenshot() {
  return (
    <WindowChrome title="Smart Expense — Planner">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-white/10 bg-slate-800/70 p-2">
          <div className="text-[9px] font-semibold text-white">Emergency Fund</div>
          <div className="mt-1 h-1.5 rounded-full bg-slate-700">
            <div className="h-1.5 w-[68%] rounded-full bg-indigo-400" />
          </div>
          <div className="mt-1 text-[8px] text-slate-400">₹2.04L / ₹3.00L · Dec 2026</div>
        </div>
        <div className="rounded-md border border-white/10 bg-slate-800/70 p-2">
          <div className="text-[9px] font-semibold text-white">Rent (monthly)</div>
          <div className="mt-1 text-[8px] text-slate-400">Every 1st · expense</div>
          <div className="text-[10px] font-bold text-white">₹25,000</div>
        </div>
      </div>
      <div className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2">
        <div className="flex justify-between text-[9px]">
          <span className="font-medium text-amber-100">Credit Card Bill</span>
          <span className="text-amber-200">Jun 08</span>
        </div>
        <div className="text-[10px] font-bold text-white">₹12,450</div>
      </div>
      <div className="mt-2 text-[8px] text-slate-500">+ Add goal · + Add bill · + Add recurring</div>
    </WindowChrome>
  )
}

export function AnalyticsScreenshot() {
  return (
    <WindowChrome title="Smart Expense — Analytics">
      <div className="h-24 rounded-md border border-white/10 bg-slate-800/60 p-2">
        <div className="text-[9px] text-slate-400">Spending trend</div>
        <svg viewBox="0 0 200 60" className="mt-1 h-14 w-full">
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,50 L30,35 L60,42 L90,20 L120,28 L150,15 L180,25 L200,18 L200,60 L0,60 Z"
            fill="url(#area)"
          />
          <path
            d="M0,50 L30,35 L60,42 L90,20 L120,28 L150,15 L180,25 L200,18"
            fill="none"
            stroke="#a5b4fc"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="mt-2 flex gap-2">
        {['Food', 'Travel', 'Rent'].map((c, i) => (
          <div key={c} className="flex-1 rounded border border-white/10 bg-slate-800/50 p-1.5 text-center">
            <div className="text-[8px] text-slate-400">{c}</div>
            <div className="text-[10px] font-bold text-white">{['32%', '24%', '18%'][i]}</div>
          </div>
        ))}
      </div>
    </WindowChrome>
  )
}
