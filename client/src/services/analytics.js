import { api } from './api'

export async function getDashboard(params) {
  const { data } = await api.get('/api/analytics/dashboard', { params })
  return data
}

export async function getInsights(params) {
  const { data } = await api.get('/api/analytics/insights', { params })
  return data
}

export async function getCharts(params) {
  const { data } = await api.get('/api/analytics/charts', { params })
  return data
}

