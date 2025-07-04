// Email validation
export function isValidEmail(email) {
    // RFC 5322 compliant email regex
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return typeof email === 'string' && emailRegex.test(email)
}

// Password validation (min 6 chars)
export function isValidPassword(password) {
    return typeof password === 'string' && password.length >= 6
}

// Name validation (2-50 chars)
export function isValidName(name) {
    return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 50
}

// Role validation
export function isValidRole(role) {
    return ['user', 'admin'].includes(role)
}

// ObjectId validation (for MongoDB)
import mongoose from 'mongoose'
export function isValidObjectId(id) {
    if (!id) return false
    if (typeof id === 'string') {
        return id.trim().length > 0 && mongoose.Types.ObjectId.isValid(id)
    }
    if (typeof id === 'object' && id instanceof mongoose.Types.ObjectId) {
        return mongoose.Types.ObjectId.isValid(id)
    }
    return false
}
