import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { ThemeProvider as UIThemeProvider } from "./components/theme-provider"
import { ThemeProvider } from "./components/theme-context"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import Dashboard from "./components/dashboard/Dashboard"
import AskAI from "./components/chat/AskAI"
import Projects from "./components/Projects"
import Profile from "./components/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
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
