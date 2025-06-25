import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

// Import routes
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

// Import config modules
import connectDB from "./config/db.js"
import corsOptions from "./config/corsOptions.js"
import validateEnv from "./config/validateEnv.js"

dotenv.config()

validateEnv()

const app = express()

// Configure CORS with imported options
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-XSS-Protection", "1; mode=block")
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  next()
})

// Health check route (must be before other routes)
app.get("/api/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping()
    res.json({
      success: true,
      message: "Server is running",
      database: "connected",
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      database: "disconnected",
    })
  }
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/dashboard", dashboardRoutes)

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  })

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  })
})

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  process.exit(1)
})
