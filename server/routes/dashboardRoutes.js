import express from "express"
import { getUserDashboard, getUserUploads, deleteUpload, uploadParsedData, getUploadData } from "../controllers/dashboardController.js"
import { authenticateToken } from "../middleware/auth.js"
import multer from "multer"
import { uploadExcelData } from "../controllers/dashboardController.js"

const router = express.Router()

const upload = multer({ dest: "uploads/" })

router.get("/user", authenticateToken, getUserDashboard)
router.post("/upload", authenticateToken, upload.single("file"), uploadExcelData)
router.post("/upload-data", authenticateToken, uploadParsedData)
router.get("/uploads", authenticateToken, getUserUploads)
router.get("/uploads/:id", authenticateToken, getUploadData)
router.delete("/uploads/:id", authenticateToken, deleteUpload)

export default router
