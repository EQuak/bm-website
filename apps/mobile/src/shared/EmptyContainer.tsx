import { View } from "react-native"
import { Text } from "#/components/ui/text"

interface EmptyContainerProps {
  headerText: string
  subheaderText?: string
  icon?: React.ReactNode
}

export const EmptyContainer = ({
  headerText,
  subheaderText,
  icon
}: EmptyContainerProps) => {
  return (
    <View className="flex-1 items-center justify-center px-4 py-16">
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="mb-2 text-center font-semibold text-gray-900 text-lg">
        {headerText}
      </Text>
      {subheaderText && (
        <Text className="text-center text-base text-gray-600">
          {subheaderText}
        </Text>
      )}
    </View>
  )
}
