import { Stack } from "expo-router"
import { View } from "react-native"
import { Text } from "#/components/ui/text"

export default function SettingsIndexScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Stack.Screen options={{ title: "Settings" }} />
      <Text variant="h2" className="mb-2">
        Settings
      </Text>
      <Text className="text-muted-foreground">
        Use the drawer menu to open Profile, User Roles, or General Settings.
        Platform staff can open Platform from the drawer for internal tools.
      </Text>
    </View>
  )
}
