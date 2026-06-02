export function Pagination({ page, pages, onPage }) {
  if (!pages || pages <= 1) return null
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="text-slate-500 dark:text-slate-400">
        Page {page} of {pages}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-50 dark:border-slate-800"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Prev
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-50 dark:border-slate-800"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

