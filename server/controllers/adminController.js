import User from "../models/User.js"
import mongoose from "mongoose"
import { isValidEmail, isValidName, isValidRole, isValidObjectId } from "../utils/validation.js"

// Get all users with pagination
export const getAllUsers = async (req, res) => {
  try {
    // Validate and sanitize pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1
    const search = req.query.search ? req.query.search.trim() : ""

    // Validate sortBy field to prevent NoSQL injection
    const allowedSortFields = ["createdAt", "name", "email", "role", "isActive"]
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"

    // Build search query with regex escaping to prevent ReDoS attacks
    const searchQuery = search
      ? {
          $or: [
            {
              name: {
                $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                $options: "i",
              },
            },
            {
              email: {
                $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                $options: "i",
              },
            },
          ],
        }
      : {}

    const users = await User.find(searchQuery)
      .sort({ [safeSortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-password")

    const total = await User.countDocuments(searchQuery)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
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

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id

    // Validate ObjectId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      })
    }

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: { user },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body
    const userId = req.params.id

    // Validate ObjectId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      })
    }

    // Input validation
    if (name !== undefined) {
      if (!isValidName(name)) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 50 characters",
        })
      }
    }

    if (email !== undefined) {
      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        })
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        })
      }
    }

    // Validate role
    if (role !== undefined && !isValidRole(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      })
    }

    // Validate isActive
    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value",
      })
    }

    // Prevent admin from deactivating themselves
    if (
      userId.toString() === req.user._id.toString() &&
      isActive === false
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot deactivate your own account",
      })
    }

    // Prevent admin from demoting themselves
    if (userId.toString() === req.user._id.toString() && role === "user") {
      return res.status(400).json({
        success: false,
        message: "Cannot demote yourself from admin role",
      })
    }

    // Prepare update data
    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (email !== undefined) updateData.email = email.toLowerCase()
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user: updatedUser },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id

    // Validate ObjectId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      })
    }

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      })
    }

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const adminUsers = await User.countDocuments({ role: "admin" })
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt")

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          adminUsers,
        },
        recentUsers,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
