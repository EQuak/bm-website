export const CARD_TYPE_OPTIONS = [
  { value: "certification", label: "Certification", color: "#10B981" },
  { value: "forklift", label: "Forklift", color: "#3B82F6" },
  { value: "boom-lift", label: "Boom Lift", color: "#F59E0B" },
  { value: "scissor-lift", label: "Scissor Lift", color: "#8B5CF6" }
] as const

export const getCardTypeInfo = (
  cardType: "certification" | "forklift" | "boom-lift" | "scissor-lift"
) => {
  return (
    CARD_TYPE_OPTIONS.find((option) => option.value === cardType) || {
      value: cardType,
      label: cardType,
      color: "#6B7280"
    }
  )
}
