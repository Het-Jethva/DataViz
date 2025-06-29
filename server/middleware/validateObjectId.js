import { isValidObjectId } from '../utils/validation.js'

// Usage: validateObjectId('id') for req.params.id
export function validateObjectId(paramName) {
    return (req, res, next) => {
        const id = req.params[paramName]
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID',
            })
        }
        next()
    }
}
