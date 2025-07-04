import express from 'express'
import { register, login, logout, getProfile, updateProfile, changePassword } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'
import {
    validateName,
    validateEmail,
    validatePassword,
    validateRole,
    validateNameAndEmail,
    validateChangePassword,
} from '../middleware/validation.js'

const router = express.Router()

// Public routes
router.post('/register', validateName, validateEmail, validatePassword, validateRole, register)
router.post('/login', validateEmail, validatePassword, login)
router.post('/logout', logout)

// Protected routes
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, validateNameAndEmail, updateProfile)
router.put('/change-password', authenticateToken, validateChangePassword, changePassword)

export default router
