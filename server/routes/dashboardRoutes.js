import express from "express"
import { getUserDashboard, getUserUploads, deleteUpload } from "../controllers/dashboardController.js"
import { authenticateToken } from "../middleware/auth.js"
import multer from "multer"
import { uploadExcelData } from "../controllers/dashboardController.js"

const router = express.Router()

const upload = multer({ dest: "uploads/" })

router.get("/user", authenticateToken, getUserDashboard)
router.post("/upload", authenticateToken, upload.single("file"), uploadExcelData)
router.get("/uploads", authenticateToken, getUserUploads)
router.delete("/uploads/:id", authenticateToken, deleteUpload)

export default router
