/**
 * Format a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Jan 15, 2024, 10:30 AM")
 */
export function formatDate(date: Date | null): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

/**
 * Format relative time (e.g., "5 minutes ago", "2 hours ago")
 * Shows full date if more than 5 days ago
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return ""
  const now = new Date()
  const messageDate = new Date(date)
  const diffMs = now.getTime() - messageDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays > 5) {
    return formatDate(date)
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffMinutes < 1) {
    return "just now"
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`
  }
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
  }
  if (diffDays === 1) {
    return "1 day ago"
  }
  return `${diffDays} days ago`
}

/**
 * Format message time with date and relative/exact time
 * Shows "X minutes ago" if less than 20 minutes, otherwise shows exact time
 * @param date - Date to format
 * @returns Formatted message time string
 */
export function formatMessageTime(date: Date | null): string {
  if (!date) return ""

  const now = new Date()
  const messageDate = new Date(date)
  const diffMs = now.getTime() - messageDate.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  // Get date part (M/D/YYYY)
  const dateStr = messageDate.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric"
  })

  if (diffMinutes < 20) {
    // Show "X minutes ago" format
    const relativeStr = formatRelativeTime(date)
    return `${dateStr}, ${relativeStr}`
  } else {
    // Show exact time format (h:mm AM/PM)
    const timeStr = messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
    return `${dateStr}, ${timeStr}`
  }
}
