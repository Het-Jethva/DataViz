import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, logoutUser } from "../../redux/slices/authSlice"
import { getDashboardData } from "../../redux/slices/dashboardSlice"
import DashboardHeader from "./DashboardHeader"
import ProfileCard from "./ProfileCard"
import UploadSection from "./UploadSection"
import UploadHistory from "./UploadHistory"
import { Card, CardContent } from "@/components/ui/card"

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { profile, uploadHistory, isLoading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    dispatch(getCurrentUser())
    dispatch(getDashboardData())
  }, [dispatch, navigate, isAuthenticated])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-6" />
            <h3 className="text-lg font-semibold text-center mb-2">Loading Dashboard</h3>
            <p className="text-muted-foreground text-center">Please wait while we prepare your workspace...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4">
      <DashboardHeader user={user || profile} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileCard user={user || profile} />
          </div>
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
