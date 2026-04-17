import { config as loadEnv } from "dotenv"
import type { ExpoConfig } from "expo/config"
import path from "path"

// Try to load env from project root if present
const rootEnvCandidates = [
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env")
]
for (const p of rootEnvCandidates) {
  loadEnv({ path: p, override: false })
}

const config: ExpoConfig = {
  name: "App Template",
  slug: "app-template",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/app-icon-placeholder.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-placeholder.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    package: "com.example.apptemplate",
    adaptiveIcon: {
      foregroundImage: "./assets/app-icon-placeholder.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false
    // usesCleartextTraffic: true
  },
  web: {
    favicon: "./assets/app-icon-placeholder.png",
    bundler: "metro"
  },
  extra: {
    router: {
      origin: false
    },
    EXPO_PUBLIC_SUPABASE_URL:
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY:
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY
  }
}

export default config
