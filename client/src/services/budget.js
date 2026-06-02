import { api } from './api'

export async function getBudget() {
  const { data } = await api.get('/api/budget')
  return data
}

export async function setBudget(monthlyLimit) {
  const { data } = await api.put('/api/budget', { monthlyLimit })
  return data
}

