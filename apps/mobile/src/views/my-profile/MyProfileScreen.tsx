import { Ionicons } from "@expo/vector-icons"
import { Stack, useRouter } from "expo-router"
import { useState } from "react"
import { Image, Pressable, ScrollView, View } from "react-native"
import { Card, CardContent } from "#/components/ui/card"
import { Text } from "#/components/ui/text"
import { useApp } from "#/context/AppContext"

type DetailSection = {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
}

export function MyProfileScreen() {
  const router = useRouter()
  const { profile: employee } = useApp()
  const [imageError, setImageError] = useState(false)

  const AvatarComponent = () => {
    const displayName =
      employee?.fullName || employee?.firstName || "My Profile"
    const initials = displayName.split(" ").map((n: string) => n[0])
    if (employee?.avatar && !imageError) {
      return (
        <Image
          source={{ uri: employee.avatar }}
          className="h-20 w-20 rounded-full bg-gray-100"
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
      )
    }

    return (
      <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-500">
        <Text className="font-semibold text-2xl text-white">{initials}</Text>
      </View>
    )
  }

  const sections: DetailSection[] = [
    {
      title: "Basic Info",
      icon: "person-outline",
      onPress: () => router.push("/(application)/app/my-profile/basic-info")
    }
  ]

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: "My Profile" }} />
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="mb-6 items-center">
          <AvatarComponent />
          <Text variant="h2" className="mt-4 text-center">
            {employee?.fullName ||
              `${employee?.firstName ?? ""} ${employee?.lastName ?? ""}`.trim() ||
              "My Profile"}
          </Text>
          <Text className="mt-1 text-center text-muted-foreground">
            {employee?.user?.email}
          </Text>
        </View>

        <Card className="border-gray-200 bg-white">
          <CardContent className="py-2">
            {sections.map((section) => (
              <Pressable
                key={section.title}
                onPress={section.onPress}
                className="flex-row items-center border-gray-100 border-b py-4 last:border-b-0"
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Ionicons name={section.icon} size={22} color="#2563eb" />
                </View>
                <Text className="flex-1 font-medium text-base text-foreground">
                  {section.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </Pressable>
            ))}
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  )
}
