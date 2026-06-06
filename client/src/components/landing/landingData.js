export const featureCards = [
  {
    title: 'Smart Expense Tracking',
    desc: 'Log income and expenses with categories, notes, bulk actions, and powerful filters.',
    icon: '💳',
    tag: 'Core',
  },
  {
    title: 'Budget Management',
    desc: 'Set monthly limits with 80% and 100% threshold warnings before overspending.',
    icon: '🎯',
    tag: 'Control',
  },
  {
    title: 'Advanced Analytics',
    desc: 'Trend charts, category breakdowns, and month-over-month comparisons.',
    icon: '📊',
    tag: 'Insights',
  },
  {
    title: 'AI-Style Insights',
    desc: 'Rule-based messages like category spikes and spending behavior changes.',
    icon: '✨',
    tag: 'Smart',
  },
  {
    title: 'Manual Financial Planner',
    desc: 'Create savings goals, recurring transactions, and upcoming bills with full control.',
    icon: '🏦',
    tag: 'Planner',
  },
  {
    title: 'CSV Export',
    desc: 'Export filtered transaction data for reports, audits, and spreadsheets.',
    icon: '📁',
    tag: 'Reports',
  },
  {
    title: 'Admin Command Center',
    desc: 'Manage users and global transactions with role-based secure access.',
    icon: '🛡️',
    tag: 'Admin',
  },
  {
    title: 'Dark Mode & Security',
    desc: 'JWT access + refresh tokens, protected routes, and polished dark UI.',
    icon: '🔐',
    tag: 'Secure',
  },
]

export const extraFeatures = [
  'Manual savings goals',
  'Recurring transactions',
  'Upcoming bills',
  'Financial calendar',
  'Category heatmaps',
  'Transaction timeline',
  'Debounced search',
  'Optimistic UI updates',
  'Pagination at scale',
]

export const testimonials = [
  {
    quote: 'This looks like a funded SaaS product — not a college assignment.',
    name: 'Priya S.',
    role: 'Product Intern',
  },
  {
    quote: 'The analytics are clear and actionable.',
    name: 'Rahul M.',
    role: 'Full-Stack Developer',
  },
  {
    quote: 'Clean architecture plus premium UI. Recruiters noticed immediately.',
    name: 'Ananya K.',
    role: 'Software Engineer',
  },
]

export const faqs = [
  {
    q: 'Is my financial data secure?',
    a: 'Yes. Passwords are hashed with bcrypt, APIs use JWT access and refresh tokens, and routes are protected by role-based middleware.',
  },
  {
    q: 'Can I export my transactions?',
    a: 'Yes. Export filtered transactions to CSV directly from the transactions workspace.',
  },
  {
    q: 'Can I manage savings goals and bills manually?',
    a: 'Yes. The Planner lets you add savings goals (type, target amount, target date), recurring transactions, and upcoming bills yourself.',
  },
  {
    q: 'Does it support admin workflows?',
    a: 'Admin users can view platform stats, manage users, and moderate all transactions from dedicated admin pages.',
  },
]

export const productScreens = [
  {
    title: 'Dashboard',
    desc: 'Glass cards, health score, budget status, and transaction timeline.',
    component: 'dashboard',
  },
  {
    title: 'Transactions',
    desc: 'Filters, bulk delete, CSV export, and inline editing.',
    component: 'transactions',
  },
  {
    title: 'Planner',
    desc: 'Manual savings goals, recurring items, and bill reminders.',
    component: 'planner',
  },
  {
    title: 'Analytics',
    desc: 'Spending trends, category analysis, and exportable reports.',
    component: 'analytics',
  },
]
