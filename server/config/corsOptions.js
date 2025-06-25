const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? (() => {
          if (!process.env.FRONTEND_URL) {
            console.error(
              "Error: FRONTEND_URL is not set in production. Set FRONTEND_URL in your environment variables."
            )
            process.exit(1)
          }
          return process.env.FRONTEND_URL
        })()
      : [
          "http://localhost:5173",
          "http://localhost:3000",
          "http://127.0.0.1:5173",
        ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

export default corsOptions 