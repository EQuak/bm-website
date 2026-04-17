import { Link, Stack } from "expo-router"
import { Pressable, View } from "react-native"
import { Text } from "#/components/ui/text"

const LINKS = [
  {
    title: "Organizations",
    description: "Every workspace in the system (web).",
    href: "/app/settings/platform/organizations" as const
  },
  {
    title: "All users",
    description: "Profiles across all organizations (web).",
    href: "/app/settings/platform/users" as const
  },
  {
    title: "Developer tools",
    description: "Impersonation and internal utilities (web).",
    href: "/app/settings/platform/developer-tools" as const
  },
  {
    title: "App configuration",
    description: "Instance maintenance, security, and email (web).",
    href: "/app/settings/platform/app-config" as const
  }
]

export default function PlatformOverviewScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Stack.Screen options={{ title: "Platform" }} />
      <Text variant="h2" className="mb-2">
        Platform
      </Text>
      <Text className="mb-6 text-muted-foreground">
        Internal directory and tools. Full lists run in the web app; use the
        links below for detail screens or open the same paths on web.
      </Text>
      <View className="gap-2">
        {LINKS.map(({ title, description, href }) => (
          <Link key={href} href={href} asChild>
            <Pressable className="border-border border-b py-4 active:opacity-70">
              <Text className="font-semibold text-foreground">{title}</Text>
              <Text className="mt-1 text-muted-foreground text-sm">
                {description}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  )
}
