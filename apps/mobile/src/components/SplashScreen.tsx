import { Dimensions, Image, View } from "react-native"

const { width, height } = Dimensions.get("window")

/**
 * @component SplashScreen
 * @description Loading screen displayed while the app initializes and checks authentication
 */
export function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="items-center justify-center">
        <Image
          source={require("../../assets/gray-logo-mobile.png")}
          className="max-h-50 max-w-75"
          style={{
            width: width * 0.6, // 60% of screen width
            height: height * 0.3 // 30% of screen height
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  )
}
