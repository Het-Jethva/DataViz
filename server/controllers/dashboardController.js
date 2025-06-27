import User from "../models/User.js"
import xlsx from "xlsx"
import fs from "fs"
import path from "path"
import ExcelData from "../models/ExcelData.js"

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        uploadHistory: user.uploadHistory || [],
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const uploadExcelData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }
    const filePath = path.resolve(req.file.path)
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const jsonData = xlsx.utils.sheet_to_json(sheet)
    // Save jsonData to MongoDB with fileName and uploadDate
    await ExcelData.create({
      user: req.user.id,
      data: jsonData,
      fileName: req.file.originalname,
      uploadDate: Date.now()
    })
    fs.unlinkSync(filePath) // Clean up uploaded file
    return res.status(200).json({ message: "File processed and saved" })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const getUserUploads = async (req, res) => {
  try {
    const uploads = await ExcelData.find({ user: req.user.id }).sort({ uploadDate: -1 })
    // Only return relevant fields
    const formattedUploads = uploads.map(upload => ({
      _id: upload._id,
      fileName: upload.fileName,
      uploadDate: upload.uploadDate,
      data: upload.data
    }))
    res.status(200).json({ uploads: formattedUploads })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params
    const upload = await ExcelData.findOneAndDelete({ _id: id, user: req.user.id })
    if (!upload) {
      return res.status(404).json({ error: "Upload not found or not authorized" })
    }
    res.status(200).json({ message: "Upload deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

