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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="size-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 size-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin mx-auto"
              style={{ animationDelay: "0.15s" }}
            ></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Loading Dashboard
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Please wait while we prepare your workspace...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <DashboardHeader
        user={user || profile}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <ProfileCard user={user || profile} />
          </div>

          {/* Right Column - Upload & History */}
          <div className="lg:col-span-2 space-y-8">
            <UploadSection />
            <UploadHistory history={uploadHistory} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
