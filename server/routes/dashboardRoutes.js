import express from "express"
import { getUserDashboard, getUserUploads, deleteUpload } from "../controllers/dashboardController.js"
import { authenticateToken } from "../middleware/auth.js"
import multer from "multer"
import { uploadExcelData } from "../controllers/dashboardController.js"
import path from "path"

const router = express.Router()

// Enhanced multer configuration with security measures
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow 1 file at a time
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel" // .xls
    ]
    
    const allowedExtensions = [".xlsx", ".xls"]
    const fileExtension = path.extname(file.originalname).toLowerCase()
    
    if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(fileExtension)) {
      return cb(new Error("Only Excel files (.xlsx, .xls) are allowed"), false)
    }
    
    // Validate filename
    if (!file.originalname || file.originalname.length > 255) {
      return cb(new Error("Invalid filename"), false)
    }
    
    // Check for potentially dangerous characters in filename
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/
    if (dangerousChars.test(file.originalname)) {
      return cb(new Error("Filename contains invalid characters"), false)
    }
    
    cb(null, true)
  }
})

router.get("/user", authenticateToken, getUserDashboard)
router.post("/upload", authenticateToken, upload.single("file"), uploadExcelData)
router.get("/uploads", authenticateToken, getUserUploads)
router.delete("/uploads/:id", authenticateToken, deleteUpload)

export default router
