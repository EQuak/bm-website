export function formatAddress(
  street: string,
  city: string,
  state: string,
  zipCode: string,
  country?: string
) {
  if (!street || !city || !state || !zipCode) {
    return "Not Set"
  }

  const baseAddress = `${street}, ${city}, ${state} ${zipCode}`
  return country ? `${baseAddress}, ${country}` : baseAddress
}
