export function formatAddress(
  street: string,
  city: string,
  state: string,
  zipCode: string,
  country?: string
) {
  const baseAddress = `${street}, ${city}, ${state} ${zipCode}`
  return country ? `${baseAddress}, ${country}` : baseAddress
}
