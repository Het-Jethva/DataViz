import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getInitials(name) {
  if (!name || typeof name !== "string") return ""
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0][0]?.toUpperCase() || ""
  return (
    (words[0][0] || "").toUpperCase() +
    (words[words.length - 1][0] || "").toUpperCase()
  )
}

export function formatDate(date) {
  if (!date) return ""
  const d = new Date(date)
  if (isNaN(d)) return ""
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  if (!bytes && bytes !== 0) return "-"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
