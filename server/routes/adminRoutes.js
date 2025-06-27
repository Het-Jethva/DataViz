import express from "express"
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
} from "../controllers/adminController.js"
import { authenticateToken, requireAdmin } from "../middleware/auth.js"
import { validateObjectId } from "../middleware/validateObjectId.js"

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin)

// Dashboard stats
router.get("/stats", getDashboardStats)

// User management
router.get("/users", getAllUsers)
router.get("/users/:id", validateObjectId("id"), getUserById)
router.put("/users/:id", validateObjectId("id"), updateUser)
router.delete("/users/:id", validateObjectId("id"), deleteUser)

export default router
