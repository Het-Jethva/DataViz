import express from "express"
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
} from "../controllers/adminController.js"
import { authenticateToken, requireAdmin } from "../middleware/auth.js"

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin)

// Dashboard stats
router.get("/stats", getDashboardStats)

// User management
router.get("/users", getAllUsers)
router.get("/users/:id", getUserById)
router.put("/users/:id", updateUser)
router.delete("/users/:id", deleteUser)

export default router
