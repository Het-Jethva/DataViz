import User from "../models/User.js"
import { isValidEmail, isValidName, isValidRole } from "../utils/validation.js"

// Get all users with pagination and search
export async function getAllUsersService({ page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search = "" }) {
  page = Math.max(1, parseInt(page) || 1)
  limit = Math.min(100, Math.max(1, parseInt(limit) || 10))
  const allowedSortFields = ["createdAt", "name", "email", "role", "isActive"]
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"
  const order = sortOrder === "asc" ? 1 : -1
  const searchQuery = search
    ? {
        $or: [
          { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
          { email: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
        ],
      }
    : {}
  const users = await User.find(searchQuery)
    .sort({ [safeSortBy]: order })
    .limit(limit)
    .skip((page - 1) * limit)
    .select("-password")
  const total = await User.countDocuments(searchQuery)
  return {
    users,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    },
  }
}

// Get user by ID
export async function getUserByIdService(userId) {
  const user = await User.findById(userId).select("-password")
  if (!user) throw new Error("User not found")
  return user
}

// Update user (admin only)
export async function updateUserService({ userId, updateData, currentUser }) {
  const { name, email, role, isActive } = updateData
  // Validation for name, email, and role is handled by middleware
  if (email !== undefined) {
    const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: userId } })
    if (existingUser) throw new Error("Email already in use")
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    throw new Error("isActive must be a boolean value")
  }
  if (userId.toString() === currentUser._id.toString() && isActive === false) {
    throw new Error("Cannot deactivate your own account")
  }
  if (userId.toString() === currentUser._id.toString() && role === "user") {
    throw new Error("Cannot demote yourself from admin role")
  }
  const updateFields = {}
  if (name !== undefined) updateFields.name = name.trim()
  if (email !== undefined) updateFields.email = email.toLowerCase()
  if (role !== undefined) updateFields.role = role
  if (isActive !== undefined) updateFields.isActive = isActive
  const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true }).select("-password")
  if (!updatedUser) throw new Error("User not found")
  return updatedUser
}

// Delete user (admin only)
export async function deleteUserService({ userId, currentUser }) {
  if (userId === currentUser._id.toString()) {
    throw new Error("Cannot delete your own account")
  }
  const deletedUser = await User.findByIdAndDelete(userId)
  if (!deletedUser) throw new Error("User not found")
  return true
}

// Get dashboard statistics
export async function getDashboardStatsService() {
  const totalUsers = await User.countDocuments()
  const activeUsers = await User.countDocuments({ isActive: true })
  const adminUsers = await User.countDocuments({ role: "admin" })
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt")
  return {
    stats: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminUsers,
    },
    recentUsers,
  }
} 