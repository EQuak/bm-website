import { Stack } from "expo-router"
import { View } from "react-native"
import { Text } from "#/components/ui/text"

export default function AppConfigPlaceholderScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Stack.Screen options={{ title: "App configuration" }} />
      <Text variant="h2" className="mb-2">
        App configuration
      </Text>
      <Text className="text-muted-foreground">
        Maintenance mode, secure mode, and email provider settings are available
        in the web app under Platform → App configuration.
      </Text>
    </View>
  )
}
