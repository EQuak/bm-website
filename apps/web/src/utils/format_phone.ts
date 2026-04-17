export const formatPhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) return phoneNumber
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
}
