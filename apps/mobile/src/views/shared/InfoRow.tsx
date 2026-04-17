import { Pressable, View } from "react-native"
import { Text } from "#/components/ui/text"

export const InfoRow = ({
  className,
  label,
  value,
  onPress,
  isLast,
  isHeader
}: {
  className?: string
  label: string
  value?: string | null
  onPress?: () => void
  isLast?: boolean
  isHeader?: boolean
}) => {
  // if (!value) return null

  const content = (
    <View
      className={`flex-row items-center justify-between px-4 py-4 ${!isLast ? "border-gray-200 border-b" : ""} ${className}`}
    >
      <Text
        className={`flex-1 font-normal text-base text-muted-foreground ${isHeader ? "font-semibold text-primary" : ""}`}
      >
        {label}
      </Text>
      <Text className="flex-1 text-right font-normal text-base text-foreground">
        {value}
      </Text>
    </View>
  )

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-70">
        {content}
      </Pressable>
    )
  }

  return content
}
