import User from "../models/User.js"
import xlsx from "xlsx"
import fs from "fs"
import path from "path"
import ExcelData from "../models/ExcelData.js"

export async function getUserDashboardService(userId) {
  const user = await User.findById(userId).select("-password")
  if (!user) throw new Error("User not found")
  return {
    profile: {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    uploadHistory: user.uploadHistory || [],
  }
}

export async function uploadExcelDataService({ file, userId }) {
  if (!file) throw new Error("No file uploaded")
  const filePath = path.resolve(file.path)
  const workbook = xlsx.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const jsonData = xlsx.utils.sheet_to_json(sheet)
  await ExcelData.create({
    user: userId,
    data: jsonData,
    fileName: file.originalname,
    uploadDate: Date.now(),
  })
  fs.unlinkSync(filePath)
  return true
}

export async function getUserUploadsService(userId) {
  const uploads = await ExcelData.find({ user: userId }).sort({ uploadDate: -1 })
  return uploads.map(upload => ({
    _id: upload._id,
    fileName: upload.fileName,
    uploadDate: upload.uploadDate,
    data: upload.data,
  }))
}

export async function deleteUploadService({ uploadId, userId }) {
  const upload = await ExcelData.findOneAndDelete({ _id: uploadId, user: userId })
  if (!upload) throw new Error("Upload not found or not authorized")
  return true
} 