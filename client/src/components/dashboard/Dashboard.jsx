import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, logoutUser } from "../../redux/slices/authSlice"
import { getDashboardData } from "../../redux/slices/dashboardSlice"
import DashboardHeader from "./DashboardHeader"
import ProfileCard from "./ProfileCard"
import UploadSection from "./UploadSection"
import UploadHistory from "./UploadHistory"

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { profile, uploadHistory, isLoading } = useSelector(
    (state) => state.dashboard
  )

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    dispatch(getCurrentUser())
    dispatch(getDashboardData())
  }, [dispatch, isAuthenticated, navigate])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader
        user={user || profile}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard user={user || profile} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <UploadSection />
            <UploadHistory history={uploadHistory} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
