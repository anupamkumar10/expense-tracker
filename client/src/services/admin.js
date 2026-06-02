import { api } from './api'

export async function getAdminStats() {
  const { data } = await api.get('/api/admin/stats')
  return data
}

export async function listUsers(params) {
  const { data } = await api.get('/api/admin/users', { params })
  return data
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/api/admin/users/${id}`)
  return data
}

export async function listAllTransactions(params) {
  const { data } = await api.get('/api/admin/transactions', { params })
  return data
}

export async function deleteAnyTransaction(id) {
  const { data } = await api.delete(`/api/admin/transactions/${id}`)
  return data
}

