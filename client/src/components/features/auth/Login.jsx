import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { LoginForm } from "../login-form"
import { ThemeSelector } from "../theme-selector"
import { useColorTheme } from "../theme-context"

const Login = () => {
  const { colorTheme } = useColorTheme()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, user, navigate])
  
  // Don't render login form if user is authenticated
  if (isAuthenticated && user) {
    return null
  }
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative">
      {/* Theme Selector */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSelector />
      </div>
      <div className="w-full max-w-2xl flex items-stretch mx-auto">
        <LoginForm theme={colorTheme} className="flex-1" />
      </div>
    </div>
  )
}

export default Login
