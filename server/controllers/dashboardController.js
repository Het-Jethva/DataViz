import User from "../models/User.js"

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        uploadHistory: user.uploadHistory || [],
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

