import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidRole,
} from '../utils/validation.js'

// Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    })
}

// Register new user
export async function registerService({ name, email, password, role }) {
    // Validation is handled by middleware
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
        throw new Error('User already exists with this email')
    }
    const user = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        password,
        role: role || 'user',
    })
    await user.save()
    return user
}

// Login user
export async function loginService({ email, password }) {
    // Validation is handled by middleware
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
        throw new Error('Invalid email or password')
    }
    if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact administrator.')
    }
    const passwordIsValid = await user.comparePassword(password)
    if (!passwordIsValid) {
        throw new Error('Invalid email or password')
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
export async function updateProfileService({
    userId,
    name,
    email,
    currentEmail,
}) {
    // Validation is handled by middleware
    if (email.toLowerCase() !== currentEmail.toLowerCase()) {
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            throw new Error('Email already in use')
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
export async function changePasswordService({
    userId,
    currentPassword,
    newPassword,
}) {
    // Validation is handled by middleware
    const user = await User.findById(userId)
    if (!user) {
        throw new Error('User not found')
    }
    const currentPasswordIsValid = await user.comparePassword(currentPassword)
    if (!currentPasswordIsValid) {
        throw new Error('Current password is incorrect')
    }
    user.password = newPassword
    await user.save()
    return true
}
