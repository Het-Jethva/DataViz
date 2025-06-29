import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/redux/store"
import { ThemeProvider as UIThemeProvider } from "./components/common/theme-provider"
import { ThemeProvider } from "./components/common/theme-context"
import Login from "./components/features/auth/Login"
import Signup from "./components/features/auth/Signup"
import Dashboard from "./components/features/dashboard/Dashboard"
import AskAI from "./components/features/chat/AskAI"
import Projects from "./components/features/Projects"
import Profile from "./components/features/Profile"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <Provider store={store}>
      <UIThemeProvider
        defaultTheme="light"
        storageKey="dataviz-ui-theme"
      >
        <ThemeProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <AskAI />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/dashboard"
                      replace
                    />
                  }
                />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </ThemeProvider>
      </UIThemeProvider>
    </Provider>
  )
}

export default App
