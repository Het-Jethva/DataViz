import { 
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  getDashboardStatsService,
} from "../services/userService.js"
import { isValidObjectId } from "../utils/validation.js"

// Get all users with pagination
export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, search } = req.query
    const result = await getAllUsersService({ page, limit, sortBy, sortOrder, search })
    res.json({
      success: true,
      data: result,
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
    const user = await getUserByIdService(userId)
    res.json({
      success: true,
      data: { user },
    })
  } catch (error) {
    res.status(error.message === "User not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    })
  }
}

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id
    const updateData = req.body
    const updatedUser = await updateUserService({ userId, updateData, currentUser: req.user })
    res.json({
      success: true,
      message: "User updated successfully",
      data: { user: updatedUser },
    })
  } catch (error) {
    let status = 500
    if ([
      "Name must be between 2 and 50 characters",
      "Please enter a valid email address",
      "Email already in use",
      "Invalid role specified",
      "isActive must be a boolean value",
      "Cannot deactivate your own account",
      "Cannot demote yourself from admin role",
    ].includes(error.message)) {
      status = 400
    } else if (error.message === "User not found") {
      status = 404
    }
    res.status(status).json({
      success: false,
      message: error.message,
    })
  }
}

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id
    await deleteUserService({ userId, currentUser: req.user })
    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    let status = 500
    if (error.message === "Cannot delete your own account") status = 400
    else if (error.message === "User not found") status = 404
    res.status(status).json({
      success: false,
      message: error.message,
    })
  }
}

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const data = await getDashboardStatsService()
    res.json({
      success: true,
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
