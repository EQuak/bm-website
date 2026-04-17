import { Stack } from "expo-router"
import { DashboardScreen } from "#/views/dashboard/DashboardScreen"

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ title: "Dashboard" }} />
      <DashboardScreen />
    </>
  )
}
