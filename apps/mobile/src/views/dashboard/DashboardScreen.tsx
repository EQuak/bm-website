import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Pressable, ScrollView, View } from "react-native"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "#/components/ui/accordion"
import { Card, CardContent } from "#/components/ui/card"
import { Text } from "#/components/ui/text"
import { useRBAC } from "#/context/rbac"
import { DRAWER_MENU } from "../config/drawer-menu"

export function DashboardScreen() {
  const ability = useRBAC()
  const router = useRouter()

  // Check if user can access a menu item based on permissions
  const canAccessMenuItem = (
    permissions: (typeof DRAWER_MENU)[0]["permissions"]
  ) => {
    return permissions.every((permission) => {
      const canAccess = permission.actions.some((action) =>
        ability.can(action, permission.permission)
      )
      return canAccess
    })
  }

  // Filter out dashboard and get regular items and dropdown items separately
  const regularItems = DRAWER_MENU.filter(
    (item) => item.href !== "/app" && !item.links?.length
  )
  const dropdownItems = DRAWER_MENU.filter((item) => item.links?.length)

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View>
          {/* Regular Menu Items */}
          {regularItems.map((item, _index) => {
            // Check if user can access this menu item
            const canAccess = canAccessMenuItem(item.permissions)

            // Don't render the menu item if user doesn't have permission
            if (!canAccess) {
              return null
            }

            return (
              <View key={item.href} className="mt-4">
                <Pressable onPress={() => router.push(item.href)}>
                  <Card className="border-gray-200 bg-white py-4">
                    <CardContent className="flex-row items-center justify-between">
                      <View className="flex-1 flex-row items-center">
                        <View className="mr-3 w-7 items-center">
                          {item.icon?.({ size: 20, color: "#374151" })}
                        </View>
                        <Text className="font-medium text-gray-800">
                          {item.label}
                        </Text>
                      </View>
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color="#374151"
                      />
                    </CardContent>
                  </Card>
                </Pressable>
              </View>
            )
          })}

          {/* Dropdown Menu Items using Accordion */}
          <Accordion type="multiple">
            {dropdownItems.map((item, _index) => {
              // Check if user can access this dropdown menu
              const canAccess = canAccessMenuItem(item.permissions)

              // Don't render the dropdown menu if user doesn't have permission
              if (!canAccess) {
                return null
              }

              return (
                <View key={item.href} className="mt-4">
                  <AccordionItem value={item.href} className="border-0">
                    <Card className="border-gray-200 bg-white py-4">
                      <AccordionTrigger className="px-6 py-0 hover:no-underline">
                        <View className="flex-row items-center">
                          <View className="mr-3 w-7 items-center">
                            {item.icon?.({ size: 20, color: "#374151" })}
                          </View>
                          <Text>{item.label}</Text>
                        </View>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-0">
                        <View className="space-y-2">
                          {item.links?.map((category) => (
                            <Pressable
                              key={category.href}
                              onPress={() => router.push(category.href)}
                              className="my-1 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                            >
                              <Text className="font-medium text-gray-700 text-sm">
                                {category.label}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                </View>
              )
            })}
          </Accordion>
        </View>
      </ScrollView>
    </View>
  )
}
