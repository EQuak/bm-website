import { View } from "react-native"
import { cn } from "../../lib/utils"
import { Text } from "./text"

interface NotificationBadgeProps {
  count: number
  className?: string
  maxCount?: number
}

export function NotificationBadge({
  count,
  className,
  maxCount = 99
}: NotificationBadgeProps) {
  if (count <= 0) return null

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()

  return (
    <View
      className={cn(
        "h-5 min-w-5 items-center justify-center rounded-full bg-red-500",
        className
      )}
    >
      <Text className="font-bold text-white text-xs">{displayCount}</Text>
    </View>
  )
}
