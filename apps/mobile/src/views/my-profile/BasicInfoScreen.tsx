import { Stack } from "expo-router"
import { ScrollView, View } from "react-native"
import { Card, CardContent } from "#/components/ui/card"
import { Text } from "#/components/ui/text"
import { useApp } from "#/context/AppContext"

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-gray-100 border-b py-3 last:border-b-0">
      <Text className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </Text>
      <Text className="mt-1 text-base text-foreground">{value}</Text>
    </View>
  )
}

export default function BasicInfoScreen() {
  const { profile } = useApp()

  const email = profile.user?.email?.trim() || "—"
  const orgName = profile._organization?.name?.trim() || "—"

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: "Basic info" }} />
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <Card className="border-gray-200 bg-white">
          <CardContent className="py-2">
            <Row label="Full name" value={profile.fullName?.trim() || "—"} />
            <Row label="First name" value={profile.firstName} />
            <Row label="Last name" value={profile.lastName} />
            <Row label="Email" value={email} />
            <Row label="Phone" value={profile.phone?.trim() || "—"} />
            <Row label="Organization" value={orgName} />
            <Row
              label="Role"
              value={profile._aclRole?.name?.trim() || profile.aclRole}
            />
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  )
}
