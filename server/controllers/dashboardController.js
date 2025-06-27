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
    await uploadExcelDataService({ file: req.file, userId: req.user.id })
    res.status(200).json({ message: "File processed and saved" })
  } catch (error) {
    res.status(error.message === "No file uploaded" ? 400 : 500).json({ error: error.message })
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

