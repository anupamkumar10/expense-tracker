import { cn } from '../../lib/cn'

export function GlassCard({ className = '', children, title, action }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/60',
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title ? <div className="text-sm font-semibold">{title}</div> : <span />}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
