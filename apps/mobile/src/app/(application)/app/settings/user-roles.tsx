import { Stack } from "expo-router"
import { View } from "react-native"
import { Text } from "#/components/ui/text"

export default function UserRolesPlaceholderScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Stack.Screen options={{ title: "User roles" }} />
      <Text variant="h2" className="mb-2">
        User roles
      </Text>
      <Text className="text-muted-foreground">
        Role management is available in the web app. This screen is a
        placeholder for future mobile parity.
      </Text>
    </View>
  )
}
