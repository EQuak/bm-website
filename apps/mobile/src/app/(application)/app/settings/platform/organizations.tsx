import { Stack } from "expo-router"
import { View } from "react-native"
import { Text } from "#/components/ui/text"

export default function OrganizationsPlaceholderScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Stack.Screen options={{ title: "Organizations" }} />
      <Text variant="h2" className="mb-2">
        Organizations
      </Text>
      <Text className="text-muted-foreground">
        The organizations directory is available in the web app (platform staff
        only).
      </Text>
    </View>
  )
}
