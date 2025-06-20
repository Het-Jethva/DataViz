import express from "express"
import { getUserDashboard } from "../controllers/dashboardController.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/user", authenticateToken, getUserDashboard)

export default router
