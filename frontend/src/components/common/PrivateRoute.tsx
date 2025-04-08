import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (!token || user.role !== 'admin') {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default PrivateRoute 