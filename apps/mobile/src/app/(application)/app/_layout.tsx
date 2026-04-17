import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Drawer } from "expo-router/drawer"
import { Image, Platform, Pressable } from "react-native"
import { AppProvider } from "#/context/AppContext"
import Sidebar from "#/views/shared/Sidebar"

export default function Layout() {
  return (
    <AppProvider>
      <Drawer
        screenOptions={(props) => ({
          headerShown: true,
          headerTitleAlign: "center",
          headerTitleContainerStyle: {
            left: Platform.OS === "ios" ? 0 : -20,
            right: 0,
            alignItems: "center"
          },
          headerLeft: () => (
            <Pressable onPress={() => props.navigation.openDrawer()}>
              <Image
                source={require("../../../../assets/new-logo-large.png")}
                style={{
                  width: 32, // 60% of screen width
                  height: 32 // 30% of screen height
                }}
                className="mb-1 ml-4"
                resizeMode="contain"
              />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => props.navigation.openDrawer()}>
              <MaterialCommunityIcons
                className="mr-4"
                name="bell-badge-outline"
                size={24}
                color="black"
              />
            </Pressable>
          )
        })}
        drawerContent={(props) => <Sidebar {...props} />}
      />
    </AppProvider>
  )
}
