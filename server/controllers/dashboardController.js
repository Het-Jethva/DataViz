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
    // Save jsonData to MongoDB
    await ExcelData.create({ user: req.user.id, data: jsonData })
    fs.unlinkSync(filePath) // Clean up uploaded file
    return res.status(200).json({ message: "File processed and saved" })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const uploadParsedData = async (req, res) => {
  try {
    const { data, filename, rowCount } = req.body
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid data format" })
    }

    // Extract headers from the first row of data
    const headers = data.length > 0 ? Object.keys(data[0]) : []
    const columnCount = headers.length

    // Determine file type from filename
    const fileType = filename.toLowerCase().endsWith('.xlsx') ? 'xlsx' : 
                    filename.toLowerCase().endsWith('.xls') ? 'xls' : 'csv'

    // Save parsed data to MongoDB with enhanced schema
    const excelData = await ExcelData.create({
      user: req.user.id,
      filename: filename,
      originalFilename: filename,
      data: data,
      rowCount: rowCount,
      columnCount: columnCount,
      headers: headers,
      fileType: fileType,
      status: 'completed',
      metadata: {
        sheetName: 'Sheet1', // Default sheet name
        description: `Uploaded ${rowCount} rows with ${columnCount} columns`,
        tags: []
      },
      uploadedAt: new Date(),
      lastAccessed: new Date(),
      isActive: true
    })

    res.status(200).json({ 
      success: true,
      message: "Data uploaded successfully",
      uploadId: excelData._id,
      rowCount: data.length,
      columnCount: columnCount,
      headers: headers
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const getUserUploads = async (req, res) => {
  try {
    const uploads = await ExcelData.find({ 
      user: req.user.id,
      isActive: true 
    })
    .select('filename originalFilename rowCount columnCount headers fileType status uploadedAt lastAccessed metadata')
    .sort({ uploadedAt: -1 })
    .lean()

    // Transform the data to match frontend expectations
    const formattedUploads = uploads.map(upload => ({
      id: upload._id,
      filename: upload.filename,
      originalFilename: upload.originalFilename,
      uploadDate: upload.uploadedAt,
      lastAccessed: upload.lastAccessed,
      rowCount: upload.rowCount,
      columnCount: upload.columnCount,
      headers: upload.headers,
      fileType: upload.fileType,
      status: upload.status,
      metadata: upload.metadata
    }))

    res.status(200).json({ 
      success: true,
      uploads: formattedUploads 
    })
  } catch (error) {
    console.error('Get uploads error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const getUploadData = async (req, res) => {
  try {
    const { id } = req.params
    
    const upload = await ExcelData.findOne({ 
      _id: id, 
      user: req.user.id,
      isActive: true 
    })

    if (!upload) {
      return res.status(404).json({ 
        success: false,
        error: "Upload not found or not authorized" 
      })
    }

    // Update last accessed time
    await upload.updateLastAccessed()

    res.status(200).json({ 
      success: true,
      data: upload.data,
      metadata: {
        filename: upload.filename,
        rowCount: upload.rowCount,
        columnCount: upload.columnCount,
        headers: upload.headers,
        fileType: upload.fileType,
        uploadedAt: upload.uploadedAt
      }
    })
  } catch (error) {
    console.error('Get upload data error:', error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params
    const upload = await ExcelData.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { isActive: false },
      { new: true }
    )
    
    if (!upload) {
      return res.status(404).json({ error: "Upload not found or not authorized" })
    }
    
    res.status(200).json({ 
      success: true,
      message: "Upload deleted successfully" 
    })
  } catch (error) {
    console.error('Delete upload error:', error)
    res.status(500).json({ error: error.message })
  }
}

