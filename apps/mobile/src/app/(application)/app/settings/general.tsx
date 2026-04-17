import { Stack } from "expo-router"
import { View } from "react-native"
import { Text } from "#/components/ui/text"

export default function GeneralSettingsPlaceholderScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Stack.Screen options={{ title: "General settings" }} />
      <Text variant="h2" className="mb-2">
        General settings
      </Text>
      <Text className="text-muted-foreground">
        Organization-wide settings are managed in the web app for now.
      </Text>
    </View>
  )
}
