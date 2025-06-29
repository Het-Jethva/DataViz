import mongoose from "mongoose"

const excelDataSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalFilename: {
    type: String,
    required: true,
    trim: true
  },
  data: { 
    type: [Object], 
    required: true 
  },
  rowCount: {
    type: Number,
    required: true,
    min: 0
  },
  columnCount: {
    type: Number,
    required: true,
    min: 0
  },
  headers: {
    type: [String],
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  fileType: {
    type: String,
    enum: ['xlsx', 'xls', 'csv'],
    default: 'xlsx'
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'error'],
    default: 'completed'
  },
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  },
  metadata: {
    sheetName: String,
    description: String,
    tags: [String]
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
excelDataSchema.index({ user: 1, uploadedAt: -1 })
excelDataSchema.index({ user: 1, filename: 1 })
excelDataSchema.index({ status: 1 })
excelDataSchema.index({ uploadedAt: -1 })

// Virtual for file size in MB
excelDataSchema.virtual('fileSizeMB').get(function() {
  return this.fileSize ? (this.fileSize / (1024 * 1024)).toFixed(2) : 0
})

// Method to update last accessed time
excelDataSchema.methods.updateLastAccessed = function() {
  this.lastAccessed = new Date()
  return this.save()
}

// Method to get data summary
excelDataSchema.methods.getDataSummary = function() {
  return {
    id: this._id,
    filename: this.filename,
    rowCount: this.rowCount,
    columnCount: this.columnCount,
    headers: this.headers,
    uploadedAt: this.uploadedAt,
    lastAccessed: this.lastAccessed,
    status: this.status
  }
}

export default mongoose.model("ExcelData", excelDataSchema) 