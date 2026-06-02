import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FullPageSpinner } from '../ui/Spinner'

export function AdminRoute({ children }) {
  const { loading, isAuthenticated, isAdmin } = useAuth()
  if (loading) return <FullPageSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/app/dashboard" replace />
  return children
}

