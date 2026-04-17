import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, Image, View } from "react-native"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Text } from "#/components/ui/text"

import { useAuth } from "#/context/AuthContext"

export function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      // Navigate to app after successful login
      router.replace("/app")
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "An error occurred"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center bg-white">
      <View className="w-full self-center p-6">
        {/* White Card Container */}
        <Image
          source={require("../../../assets/gray-logo-mobile.png")}
          className="mb-8 h-20 w-96 self-center"
          resizeMode="contain"
        />

        <Text className="mb-8 text-center font-bold text-2xl text-gray-800">
          Welcome Back
        </Text>

        {/* Email Input */}
        <View className="mb-2">
          <Text className="mb-2 font-semibold text-base text-gray-800">
            Email *
          </Text>
          <Input
            className="rounded-lg border border-gray-300 bg-white shadow-none"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text className="mt-2 text-right text-gray-500 text-sm">
            Forgot Email?
          </Text>
        </View>

        {/* Password Input */}
        <View className="mb-8">
          <Text className="mb-2 font-semibold text-base text-gray-800">
            Password *
          </Text>
          <Input
            className="rounded-lg border border-gray-300 bg-white shadow-none"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text className="mt-2 text-right text-gray-500 text-sm">
            Forgot Password?
          </Text>
        </View>

        {/* Login Button */}
        <Button onPress={handleLogin} disabled={loading}>
          <Text className="justify-center text-center font-bold text-lg text-white">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Button>
      </View>
    </View>
  )
}
