const UploadHistory = ({ history = [], onView, onDelete }) => {
  const handleView = (item, index) => {
    if (onView) {
      onView(item, index)
    }
  }

  const handleDelete = (item, index) => {
    if (onDelete) {
      onDelete(item, index)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Recently uploaded"

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Recently uploaded"
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ""

    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload History
        </h2>
        <p className="text-gray-600">
          View and manage your previously uploaded files
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No uploads yet
          </h3>
          <p className="text-gray-600">
            Upload your first Excel file to get started with data visualization
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center flex-1">
                <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {item.filename || `Upload ${index + 1}`}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{formatDate(item.uploadDate)}</span>
                    {item.fileSize && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(item.fileSize)}</span>
                      </>
                    )}
                    {item.rowCount && (
                      <>
                        <span>•</span>
                        <span>{item.rowCount} rows</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleView(item, index)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  title="View file"
                  aria-label={`View ${item.filename || `Upload ${index + 1}`}`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item, index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  title="Delete file"
                  aria-label={`Delete ${
                    item.filename || `Upload ${index + 1}`
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UploadHistory
