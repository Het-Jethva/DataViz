import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { getCurrentUser } from "../redux/slices/authSlice"

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if user is authenticated on component mount
    if (!isAuthenticated && !isLoading) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isAuthenticated, isLoading])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Render children if authenticated
  return children
} 