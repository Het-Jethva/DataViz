import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { isValidEmail, isValidPassword, isValidName, isValidRole } from "../utils/validation.js"

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

// Set cookie with JWT token
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production"
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? "none" : "lax", // Allow cross-site cookies in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  })
}

// Clear token cookie
const clearTokenCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  })
}

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      })
    }

    // Validate name length and format
    if (!isValidName(name)) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      })
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      })
    }

    // Validate role if provided
    if (role && !isValidRole(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: role || "user", // Default to user, admin can only be set by existing admin
    })

    await user.save()    // Generate token
    const token = generateToken(user._id)
    
    // Set httpOnly cookie
    setTokenCookie(res, token)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          isActive: user.isActive,
          colorTheme: user.colorTheme,
        },
      },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      })
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact administrator.",
      })
    }

    // Verify password
    const passwordIsValid = await user.comparePassword(password)
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }    // Generate token
    const token = generateToken(user._id)
    
    // Update last login
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })
    
    // Set httpOnly cookie
    setTokenCookie(res, token)

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          isActive: user.isActive,
          colorTheme: user.colorTheme,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin,
        uploadsCount: req.user.uploadsCount || 0,
        colorTheme: req.user.colorTheme,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    const userId = req.user._id

    // Input validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      })
    }

    // Validate name
    if (!isValidName(name)) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      })
    }

    // Check if email is being changed and if it's already taken
    if (email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        email: email.toLowerCase(),
      },
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Logout user
export const logout = async (req, res) => {
  try {
    clearTokenCookie(res)
    
    res.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      })
    }

    // Validate new password strength
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      })
    }

    // Ensure new password is different from current
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      })
    }

    const user = await User.findById(req.user._id)

    // Verify current password
    const currentPasswordIsValid = await user.comparePassword(currentPassword)
    if (!currentPasswordIsValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Update user color theme
export const updateColorTheme = async (req, res) => {
  try {
    const { colorTheme } = req.body
    const validThemes = ['default', 'green-teal', 'purple-blue', 'red-orange']
    if (!validThemes.includes(colorTheme)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid color theme',
      })
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { colorTheme },
      { new: true, runValidators: true }
    )
    res.json({
      success: true,
      message: 'Color theme updated',
      data: { colorTheme: user.colorTheme },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
