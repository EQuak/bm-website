import { Ionicons } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { Drawer } from "expo-router/drawer"
import { Pressable } from "react-native"

export default function MyProfileLayout() {
  return (
    <>
      <Drawer.Screen
        options={{
          title: "My Profile"
        }}
      />
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="basic-info/[id]"
          options={(props) => ({
            headerShown: true,
            headerLeft: () => (
              <Pressable onPress={() => props.navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#777777" />
              </Pressable>
            )
          })}
        />
      </Stack>
    </>
  )
}
