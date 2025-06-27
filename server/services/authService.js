import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { isValidEmail, isValidPassword, isValidName, isValidRole } from "../utils/validation.js"

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

// Register new user
export async function registerService({ name, email, password, role }) {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required")
  }
  if (!isValidName(name)) {
    throw new Error("Name must be between 2 and 50 characters")
  }
  if (!isValidEmail(email)) {
    throw new Error("Please enter a valid email address")
  }
  if (!isValidPassword(password)) {
    throw new Error("Password must be at least 6 characters long")
  }
  if (role && !isValidRole(role)) {
    throw new Error("Invalid role specified")
  }
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new Error("User already exists with this email")
  }
  const user = new User({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    role: role || "user",
  })
  await user.save()
  return user
}

// Login user
export async function loginService({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required")
  }
  if (!isValidEmail(email)) {
    throw new Error("Please enter a valid email address")
  }
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    throw new Error("Invalid email or password")
  }
  if (!user.isActive) {
    throw new Error("Account is deactivated. Please contact administrator.")
  }
  const passwordIsValid = await user.comparePassword(password)
  if (!passwordIsValid) {
    throw new Error("Invalid email or password")
  }
  user.lastLogin = new Date()
  await user.save({ validateBeforeSave: false })
  return user
}

// Get current user profile
export function getProfileService(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    uploadsCount: user.uploadsCount || 0,
  }
}

// Update user profile
export async function updateProfileService({ userId, name, email, currentEmail }) {
  if (!name || !email) {
    throw new Error("Name and email are required")
  }
  if (!isValidName(name)) {
    throw new Error("Name must be between 2 and 50 characters")
  }
  if (!isValidEmail(email)) {
    throw new Error("Please enter a valid email address")
  }
  if (email.toLowerCase() !== currentEmail.toLowerCase()) {
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw new Error("Email already in use")
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name: name.trim(), email: email.toLowerCase() },
    { new: true, runValidators: true }
  )
  return updatedUser
}

// Change password
export async function changePasswordService({ userId, currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required")
  }
  if (!isValidPassword(newPassword)) {
    throw new Error("New password must be at least 6 characters long")
  }
  if (currentPassword === newPassword) {
    throw new Error("New password must be different from current password")
  }
  const user = await User.findById(userId)
  const currentPasswordIsValid = await user.comparePassword(currentPassword)
  if (!currentPasswordIsValid) {
    throw new Error("Current password is incorrect")
  }
  user.password = newPassword
  await user.save()
  return true
} 