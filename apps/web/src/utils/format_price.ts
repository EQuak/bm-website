export function formatPriceUSD(price: string | number | null): string {
  if (price === null) return ""

  const numericPrice = typeof price === "string" ? parseFloat(price) : price

  if (isNaN(numericPrice)) return ""

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericPrice)
}
