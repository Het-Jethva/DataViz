import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.token
    
    if (!token) {
      const authHeader = req.headers.authorization
      token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      })
    }

    req.user = user
    next()
  } catch (error) {
    let message = "Invalid or expired token"
    if (error.name === "TokenExpiredError") {
      message = "Token expired"
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token"
    }
    return res.status(401).json({
      success: false,
      message,
    })
  }
}

// Admin-only middleware
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    })
  }
  next()
}

// Optional authentication (for public routes that can benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.token
    
    if (!token) {
      const authHeader = req.headers.authorization
      token = authHeader && authHeader.split(" ")[1]
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select("-password")
      if (user && user.isActive) {
        req.user = user
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }
  next()
}
