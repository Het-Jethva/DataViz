import mongoose from "mongoose"

const excelDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  data: { type: [Object], required: true },
  fileName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  analysisHistory: [
    {
      chartType: String,
      xAxis: String,
      yAxis: String,
      zAxis: String,
      options: Object,
      summary: String, // For AI summary
      createdAt: { type: Date, default: Date.now }
    }
  ]
})

export default mongoose.model("ExcelData", excelDataSchema) 