const ProfileCard = ({ user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "N/A"
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"

    const names = name.trim().split(" ")
    if (names.length >= 2) {
      return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "moderator":
        return "bg-yellow-100 text-yellow-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 border border-gray-100">
      <div className="text-center mb-6">
        <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-2xl font-bold">
            {getInitials(user?.name)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {user?.name || "User"}
        </h3>
        <p className="text-gray-600 break-all">
          {user?.email || "user@example.com"}
        </p>
        {user?.role && (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getRoleBadgeColor(
              user.role
            )}`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-600">Role</span>
          </div>
          <span className="text-sm text-gray-900 capitalize font-medium">
            {user?.role || "User"}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-green-500 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3a4 4 0 118 0v4M5 21h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-600">
              Member since
            </span>
          </div>
          <span className="text-sm text-gray-900 font-medium">
            {formatDate(user?.createdAt)}
          </span>
        </div>

        {user?.lastLogin && (
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-600">
                Last active
              </span>
            </div>
            <span className="text-sm text-gray-900 font-medium">
              {formatDate(user.lastLogin)}
            </span>
          </div>
        )}

        {user?.uploadsCount !== undefined && (
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-sm font-medium text-gray-600">
                Total uploads
              </span>
            </div>
            <span className="text-sm text-gray-900 font-medium">
              {user.uploadsCount}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileCard
