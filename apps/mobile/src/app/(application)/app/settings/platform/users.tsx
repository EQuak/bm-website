import { Stack } from "expo-router"
import { View } from "react-native"
import { Text } from "#/components/ui/text"

export default function PlatformUsersPlaceholderScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Stack.Screen options={{ title: "All users" }} />
      <Text variant="h2" className="mb-2">
        All users
      </Text>
      <Text className="text-muted-foreground">
        The master user list across all organizations is available in the web
        app (platform staff only).
      </Text>
    </View>
  )
}
