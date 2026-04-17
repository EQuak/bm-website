import { useRouter } from "expo-router"
import { useEffect } from "react"
import { Text, View } from "react-native"
import { useAuth } from "#/context/AuthContext"

export default function Index() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
    if (!loading && user) {
      router.replace("/app")
    }
  }, [loading, user])

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Loading...</Text>
    </View>
  )
}
