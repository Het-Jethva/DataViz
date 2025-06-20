import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"

function App() {
  return (
    <Provider store={store}>
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
              path="/"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />
            {/* Add more routes here as you build other features */}
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
