export const capitalizeWords = (str: string) => {
  if (!str) return ""
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const capitalizeAllLetters = (str: string) => {
  return str.toUpperCase()
}
