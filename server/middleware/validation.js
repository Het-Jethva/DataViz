import { isValidName, isValidEmail, isValidPassword, isValidRole } from '../utils/validation.js'

export function validateName(req, res, next) {
  const { name } = req.body
  if (!name || !isValidName(name)) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 50 characters',
    })
  }
  next()
}

export function validateEmail(req, res, next) {
  const { email } = req.body
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address',
    })
  }
  next()
}

export function validatePassword(req, res, next) {
  const { password } = req.body
  if (!password || !isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    })
  }
  next()
}

export function validateRole(req, res, next) {
  const { role } = req.body
  if (role && !isValidRole(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role specified',
    })
  }
  next()
}

// For update profile (name and email required)
export function validateNameAndEmail(req, res, next) {
  const { name, email } = req.body
  if (!name || !isValidName(name)) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 50 characters',
    })
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address',
    })
  }
  next()
}

// For change password (currentPassword and newPassword required)
export function validateChangePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required',
    })
  }
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long',
    })
  }
  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password',
    })
  }
  next()
} 