import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { ThemeProvider } from "./components/theme-provider"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import Dashboard from "./components/dashboard/Dashboard"
import Profile from "./components/Profile"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider
        defaultTheme="system"
        storageKey="dataviz-ui-theme"
      >
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
                element={<Dashboard />}
              />
              <Route
                path="/profile"
                element={<Profile />}
              />
              <Route
                path="/"
                element={
                  <Navigate
                    to="/login"
                    replace
                  />
                }
              />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
