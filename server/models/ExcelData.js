import mongoose from "mongoose"

const excelDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  data: { type: [Object], required: true },
  uploadedAt: { type: Date, default: Date.now }
})

export default mongoose.model("ExcelData", excelDataSchema) 