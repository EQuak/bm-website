import { Ionicons } from "@expo/vector-icons"
import type { DrawerContentComponentProps } from "@react-navigation/drawer"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import { Link, usePathname, useRouter } from "expo-router"
import type { ComponentRef } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Animated, Image, Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useApp } from "#/context/AppContext"
import { useAuth } from "#/context/AuthContext"
import { useRBAC } from "#/context/rbac"
import { cn } from "#/lib/utils"
import { DRAWER_MENU, type DrawerMenuItem } from "#/views/config/drawer-menu"

const normalizePath = (value: string) => {
  if (!value) return "/"
  const [path] = value.split(/[?#]/)
  const trimmed = path.replace(/\/?$/, "")
  return trimmed.length === 0 ? "/" : trimmed
}

const matchesPath = (
  pathname: string,
  target: string,
  { allowNested = true } = {}
) => {
  const current = normalizePath(pathname)
  const normalizedTarget = normalizePath(target)

  if (current === normalizedTarget) {
    return true
  }

  if (!allowNested || normalizedTarget === "/app") {
    return false
  }

  return current.startsWith(`${normalizedTarget}/`)
}

const isMenuItemActive = (pathname: string, item: DrawerMenuItem): boolean => {
  if (item.links?.length) {
    return item.links.some((child) => isMenuItemActive(pathname, child))
  }

  return matchesPath(pathname, item.href)
}

const useMenuAccessFilter = () => {
  const ability = useRBAC()
  const { isPlatformStaff } = useApp()

  return (item: DrawerMenuItem) => {
    if (item.platformStaffOnly && !isPlatformStaff) return false
    return item.permissions.every((permission) =>
      permission.actions.some((action) =>
        ability.can(action, permission.permission)
      )
    )
  }
}

const Avatar = ({ name, avatarUrl }: { name: string; avatarUrl?: string }) => {
  const [imageError, setImageError] = useState(false)
  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((piece) => piece[0] ?? "")
        .join("")
        .toUpperCase()
        .slice(0, 2),
    [name]
  )

  useEffect(() => {
    setImageError(false)
  }, [avatarUrl])

  if (avatarUrl && !imageError) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        className="h-14 w-14 rounded-full bg-gray-100"
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
      <Text className="font-semibold text-4xl text-background">{initials}</Text>
    </View>
  )
}

const renderIcon = (
  icon: DrawerMenuItem["icon"],
  props: { size?: number; color?: string }
) => {
  if (icon) {
    return icon(props)
  }

  return (
    <Ionicons
      name="chevron-forward"
      size={props.size ?? 18}
      color={props.color ?? "#6B7280"}
    />
  )
}

const MenuLink = ({
  item,
  closeDrawer
}: {
  item: DrawerMenuItem
  closeDrawer: () => void
}) => {
  const pathname = usePathname()
  const active = isMenuItemActive(pathname, item)

  return (
    <Link href={item.href} asChild>
      <Pressable
        onPress={closeDrawer}
        className={cn(
          "mx-2 my-1 flex-row items-center rounded-md px-3 py-3",
          active && "border border-gray-200 bg-gray-100"
        )}
      >
        <View className="mr-3 ml-1 w-7 items-center">
          {renderIcon(item.icon, {
            size: 18,
            color: active ? "#111827" : "#6B7280"
          })}
        </View>
        <Text
          className={cn(
            "text-base text-text",
            active && "font-semibold text-primary"
          )}
        >
          {item.label}
        </Text>
      </Pressable>
    </Link>
  )
}

const MenuGroup = ({
  item,
  closeDrawer,
  onExpand
}: {
  item: DrawerMenuItem & { links: DrawerMenuItem[] }
  closeDrawer: () => void
  onExpand: () => void
}) => {
  const pathname = usePathname()
  const anyChildActive = item.links.some((link) =>
    isMenuItemActive(pathname, link)
  )
  const [open, setOpen] = useState(anyChildActive)
  const rotationValue = useRef(
    new Animated.Value(anyChildActive ? 1 : 0)
  ).current

  useEffect(() => {
    if (anyChildActive) {
      setOpen(true)
      requestAnimationFrame(onExpand)
    }
  }, [anyChildActive])

  useEffect(() => {
    Animated.timing(rotationValue, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start()
  }, [open, rotationValue])

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev
      if (!prev && next) {
        requestAnimationFrame(onExpand)
      }
      return next
    })
  }

  const chevronRotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"]
  })

  return (
    <View>
      <Pressable
        onPress={toggle}
        className={cn(
          "mx-2 my-1 flex-row items-center rounded-md px-3 py-3",
          anyChildActive && "border border-gray-200 bg-gray-100"
        )}
      >
        <View className="mr-3 ml-1 w-7 items-center">
          {renderIcon(item.icon, {
            size: 18,
            color: anyChildActive ? "#111827" : "#6B7280"
          })}
        </View>
        <Text
          className={cn(
            "text-base text-text",
            anyChildActive && "font-semibold text-primary"
          )}
        >
          {item.label}
        </Text>
        <Animated.View
          className="ml-auto"
          style={{ transform: [{ rotate: chevronRotation }] }}
        >
          <Ionicons name="chevron-down" size={16} />
        </Animated.View>
      </Pressable>

      {open && (
        <View className="pl-5">
          {item.links.map((child) => (
            <MenuLink key={child.href} item={child} closeDrawer={closeDrawer} />
          ))}
        </View>
      )}
    </View>
  )
}

export default function Sidebar(props: DrawerContentComponentProps) {
  const { navigation } = props
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { profile } = useApp()
  const filterByPermissions = useMenuAccessFilter()
  const closeDrawer = () => navigation.closeDrawer()

  const displayName =
    profile?.fullName || user?.user_metadata?.full_name || "User"
  const email = user?.email || "No email"

  const menuItems = useMemo(() => {
    return DRAWER_MENU.map((item) => {
      if (!filterByPermissions(item)) {
        return null
      }

      if (item.links?.length) {
        const visibleLinks = item.links.filter(filterByPermissions)
        if (!visibleLinks.length) {
          return null
        }

        return {
          ...item,
          links: visibleLinks
        }
      }

      return item
    }).filter(Boolean) as Array<
      DrawerMenuItem | (DrawerMenuItem & { links: DrawerMenuItem[] })
    >
  }, [filterByPermissions])

  const scrollRef = useRef<ComponentRef<typeof DrawerContentScrollView> | null>(
    null
  )

  const scrollToReveal = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true })
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center border-border border-b px-5 py-4">
        <Avatar name={displayName} avatarUrl={profile?.avatar ?? undefined} />
        <View className="ml-4 flex-1">
          <Text
            className="font-extrabold text-text text-xl"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {displayName}
          </Text>
          <Text
            className="mt-1 text-gray-500"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {email}
          </Text>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 16
        }}
      >
        <View className="px-3 pb-1">
          <View className="py-4">
            {menuItems.map((item) =>
              item.links?.length ? (
                <MenuGroup
                  key={item.href}
                  item={item as DrawerMenuItem & { links: DrawerMenuItem[] }}
                  closeDrawer={closeDrawer}
                  onExpand={scrollToReveal}
                />
              ) : (
                <MenuLink
                  key={item.href}
                  item={item}
                  closeDrawer={closeDrawer}
                />
              )
            )}
          </View>
        </View>
      </DrawerContentScrollView>

      <View className="border-border border-t px-1 py-1">
        <Pressable
          className="rounded-lg bg-surface px-4 py-3 active:bg-primary/10 active:opacity-70"
          onPress={async () => {
            try {
              await signOut()
              router.replace("/login")
            } catch (error) {
              console.error("Error signing out:", error)
            }
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="#1F2937" />
            <Text className="ml-2 font-semibold text-base text-text tracking-wide">
              Logout
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
