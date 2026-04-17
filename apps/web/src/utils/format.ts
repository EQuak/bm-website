import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

// Customize thresholds for relative time
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "just now",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years"
  }
})

export function formatDate(date: Date | null) {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export function formatRelativeTime(date: Date | null) {
  if (!date) return ""
  const now = dayjs()
  const messageDate = dayjs(date)
  const diffDays = now.diff(messageDate, "day")

  if (diffDays > 5) {
    return formatDate(date)
  }

  return messageDate.fromNow()
}

/**
 * Formats a date range with smart year display
 * If both dates are in the same year, shows year only once
 * If dates span different years, shows year for both dates
 * @param startDate - Start date (optional)
 * @param endDate - End date (optional)
 * @returns Formatted date range string (MM/DD/YY format)
 */
export function formatDateRange(
  startDate?: Date | null,
  endDate?: Date | null
): string {
  // If no dates provided, return empty string
  if (!startDate && !endDate) return ""

  // If only start date, format it
  if (startDate && !endDate) {
    return dayjs(startDate).format("MM/DD/YY")
  }

  // If only end date, format it
  if (!startDate && endDate) {
    return dayjs(endDate).format("MM/DD/YY")
  }

  // Both dates exist
  const start = dayjs(startDate!)
  const end = dayjs(endDate!)

  const startYear = start.year()
  const endYear = end.year()

  if (startYear === endYear) {
    // Same year - show year only once
    return `${start.format("MM/DD")} - ${end.format("MM/DD/YY")}`
  } else {
    // Different years - show year for both dates
    return `${start.format("MM/DD/YY")} - ${end.format("MM/DD/YY")}`
  }
}

export function formatDateRangeCompact(
  startDate?: Date | null,
  endDate?: Date | null
): { short: string; full: string } {
  if (!startDate && !endDate) return { short: "", full: "" }

  if (startDate && !endDate) {
    return {
      short: dayjs(startDate).format("M/D"),
      full: dayjs(startDate).format("MM/DD/YY")
    }
  }

  if (!startDate && endDate) {
    return {
      short: dayjs(endDate).format("M/D"),
      full: dayjs(endDate).format("MM/DD/YY")
    }
  }

  const start = dayjs(startDate!)
  const end = dayjs(endDate!)

  return {
    short: `${start.format("M/D")}-${end.format("M/D")}`,
    full:
      start.year() === end.year()
        ? `${start.format("MM/DD")} - ${end.format("MM/DD/YY")}`
        : `${start.format("MM/DD/YY")} - ${end.format("MM/DD/YY")}`
  }
}

export function formatMessageTime(date: Date | null) {
  if (!date) return ""

  const now = dayjs()
  const messageDate = dayjs(date)
  const diffMinutes = now.diff(messageDate, "minute")

  // Get date part
  const dateStr = messageDate.format("M/D/YYYY")

  if (diffMinutes < 20) {
    // Show "X minutes ago" format (without specific time)
    const relativeStr = messageDate.fromNow()
    return `${dateStr}, ${relativeStr}`
  } else {
    // Show exact time format
    const timeStr = messageDate.format("h:mm A")
    return `${dateStr}, ${timeStr}`
  }
}

/**
 * Gets the initials of a name
 * If the name has 1 word, it will return the first 2 letters, If the name has just 1 letter, it will return the letter
 * If the name has 2 words, it will return the first letter of each word
 * If the name has 3 words, it will return the first letter of the first 2 words and the last word
 *
 * @param name - The name to get the initials from
 * @returns
 */
export function getNameInitials(name: string) {
  if (name.length <= 2) {
    return name
  }

  const splitName = name.split(" ")

  if (splitName.length === 2) {
    const firstLetter = splitName[0]?.[0] ?? ""
    const lastLetter = splitName[1]?.[0] ?? ""
    return firstLetter + lastLetter
  }

  // Get the fist Letter of the first and last word
  if (splitName.length > 2) {
    const firstLetter = splitName[0]?.[0] ?? ""
    const lastLetter = splitName[splitName.length - 1]?.[0] ?? ""
    return firstLetter + lastLetter
  }

  return name
}
