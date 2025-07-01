import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ThemeProvider } from './components/theme-provider'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/dashboard/Dashboard'
import Profile from './components/Profile'
import { Toaster } from '@/components/ui/sonner'
import AdminPanel from './components/admin/AdminPanel'
import PrivateRoute from './components/auth/PrivateRoute'

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider defaultTheme="system" storageKey="dataviz-ui-theme">
                <Router>
                    <div className="App">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute>
                                        <AdminPanel />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/"
                                element={<Navigate to="/login" replace />}
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
