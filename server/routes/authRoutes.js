import express from "express"
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js"
import { authenticateToken } from "../middleware/auth.js"
import { getUserDashboard } from "../controllers/dashboardController.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/profile", authenticateToken, getProfile)
router.put("/profile", authenticateToken, updateProfile)
router.put("/change-password", authenticateToken, changePassword)
router.get("/dashboard", authenticateToken, getUserDashboard)

export default router
