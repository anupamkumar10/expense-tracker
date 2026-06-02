export function Card({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">{title}</div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

