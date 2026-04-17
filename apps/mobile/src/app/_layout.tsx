import { Stack } from "expo-router"
import { AuthProvider } from "#/context/AuthContext"
import { TRPCProvider } from "#/trpc/react"
import "../../global.css"
import { PortalHost } from "@rn-primitives/portal"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
export default function Layout() {
  return (
    <TRPCProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
              // Dont show header
              screenOptions={{ headerShown: false }}
            />

            <StatusBar style="dark" />
            <PortalHost />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthProvider>
    </TRPCProvider>
  )
}
