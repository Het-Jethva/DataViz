import {
    registerService,
    loginService,
    getProfileService,
    updateProfileService,
    changePasswordService,
    generateToken,
} from '../services/authService.js'
import User from '../models/User.js'
import {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidRole,
} from '../utils/validation.js'

// Set cookie with JWT token
const setTokenCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    })
}

// Clear token cookie
const clearTokenCookie = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    })
}

// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const user = await registerService({ name, email, password, role })
        const token = generateToken(user._id)
        setTokenCookie(res, token)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    isActive: user.isActive,
                },
            },
        })
    } catch (error) {
        let status = 400
        if (error.message === 'User already exists with this email')
            status = 400
        res.status(status).json({
            success: false,
            message: error.message,
        })
    }
}

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await loginService({ email, password })
        const token = generateToken(user._id)
        user.lastLogin = new Date()
        await user.save({ validateBeforeSave: false })
        setTokenCookie(res, token)
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin,
                    isActive: user.isActive,
                },
            },
        })
    } catch (error) {
        let status = 401
        if (error.message === 'Please enter a valid email address') status = 400
        if (
            error.message ===
            'Account is deactivated. Please contact administrator.'
        )
            status = 401
        res.status(status).json({
            success: false,
            message: error.message,
        })
    }
}

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const profile = getProfileService(req.user)
        res.json({
            success: true,
            data: profile,
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
        const updatedUser = await updateProfileService({
            userId,
            name,
            email,
            currentEmail: req.user.email,
        })
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: updatedUser,
            },
        })
    } catch (error) {
        let status = 400
        if (error.message === 'Email already in use') status = 400
        if (error.message === 'User not found') status = 404
        res.status(status).json({
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
            message: 'Logged out successfully',
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
        await changePasswordService({
            userId: req.user._id,
            currentPassword,
            newPassword,
        })
        res.json({
            success: true,
            message: 'Password changed successfully',
        })
    } catch (error) {
        let status = 400
        if (error.message === 'Current password is incorrect') status = 400
        res.status(status).json({
            success: false,
            message: error.message,
        })
    }
}
