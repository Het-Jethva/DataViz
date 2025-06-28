import {
  getUserDashboardService,
  uploadExcelDataService,
  getUserUploadsService,
  deleteUploadService
} from "../services/dashboardService.js"

export const getUserDashboard = async (req, res) => {
  try {
    const data = await getUserDashboardService(req.user._id)
    res.json({
      success: true,
      data,
    })
  } catch (error) {
    res.status(error.message === "User not found" ? 404 : 500).json({ success: false, message: error.message })
  }
}

export const uploadExcelData = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    // Additional validation
    if (!req.file.originalname) {
      return res.status(400).json({ error: "Invalid file" })
    }

    await uploadExcelDataService({ file: req.file, userId: req.user.id })
    res.status(200).json({ message: "File processed and saved" })
  } catch (error) {
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File size too large. Maximum size is 10MB." })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: "Too many files. Only one file allowed." })
    }
    if (error.message.includes("Only Excel files")) {
      return res.status(400).json({ error: error.message })
    }
    if (error.message.includes("Invalid filename")) {
      return res.status(400).json({ error: error.message })
    }
    
    console.error("Upload error:", error)
    res.status(500).json({ error: "File upload failed. Please try again." })
  }
}

export const getUserUploads = async (req, res) => {
  try {
    const uploads = await getUserUploadsService(req.user.id)
    res.status(200).json({ uploads })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUpload = async (req, res) => {
  try {
    await deleteUploadService({ uploadId: req.params.id, userId: req.user.id })
    res.status(200).json({ message: "Upload deleted" })
  } catch (error) {
    res.status(error.message === "Upload not found or not authorized" ? 404 : 500).json({ error: error.message })
  }
}

