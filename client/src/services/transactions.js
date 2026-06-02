import { api } from './api'

export async function listTransactions(params) {
  const { data } = await api.get('/api/transactions', { params })
  return data
}

export async function createTransaction(payload) {
  const { data } = await api.post('/api/transactions', payload)
  return data
}

export async function updateTransaction(id, payload) {
  const { data } = await api.patch(`/api/transactions/${id}`, payload)
  return data
}

export async function deleteTransaction(id) {
  const { data } = await api.delete(`/api/transactions/${id}`)
  return data
}

export async function bulkDelete(ids) {
  const { data } = await api.post('/api/transactions/bulk-delete', { ids })
  return data
}

export function exportUrl(params) {
  const u = new URL('/api/transactions/export', window.location.origin)
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v)
  }
  return u.toString()
}

