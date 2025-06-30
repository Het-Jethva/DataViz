const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY']

const validateEnv = () => {
    const missingEnvVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
    )
    if (missingEnvVars.length > 0) {
        console.error(
            `Missing required environment variables: ${missingEnvVars.join(', ')}`
        )
        process.exit(1)
    }
}

export default validateEnv
