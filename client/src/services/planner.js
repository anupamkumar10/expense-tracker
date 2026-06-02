import { api } from './api'

export async function listSavingsGoals() {
  const { data } = await api.get('/api/planner/savings-goals')
  return data
}

export async function createSavingsGoal(payload) {
  const { data } = await api.post('/api/planner/savings-goals', payload)
  return data
}

export async function updateSavingsGoal(id, payload) {
  const { data } = await api.patch(`/api/planner/savings-goals/${id}`, payload)
  return data
}

export async function deleteSavingsGoal(id) {
  const { data } = await api.delete(`/api/planner/savings-goals/${id}`)
  return data
}

export async function listRecurring() {
  const { data } = await api.get('/api/planner/recurring')
  return data
}

export async function createRecurring(payload) {
  const { data } = await api.post('/api/planner/recurring', payload)
  return data
}

export async function updateRecurring(id, payload) {
  const { data } = await api.patch(`/api/planner/recurring/${id}`, payload)
  return data
}

export async function deleteRecurring(id) {
  const { data } = await api.delete(`/api/planner/recurring/${id}`)
  return data
}

export async function listBills() {
  const { data } = await api.get('/api/planner/bills')
  return data
}

export async function createBill(payload) {
  const { data } = await api.post('/api/planner/bills', payload)
  return data
}

export async function updateBill(id, payload) {
  const { data } = await api.patch(`/api/planner/bills/${id}`, payload)
  return data
}

export async function deleteBill(id) {
  const { data } = await api.delete(`/api/planner/bills/${id}`)
  return data
}
