/**
 * @file Shared loading spinner components for the mobile application
 * @module components/loader
 * @description Provides various loading spinner components with animations
 * @author Team TUC
 */

import React from "react"
import type { TextStyle, ViewStyle } from "react-native"
import { Modal, Text, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated"

/**
 * @interface LoadingSpinnerProps
 * @description Props for the basic loading spinner component
 *
 * @property {number} size - Size of the spinner (default: 24)
 * @property {string} color - Color of the spinner (default: #393939)
 * @property {ViewStyle} style - Additional styles for the container
 */
interface LoadingSpinnerProps {
  size?: number
  color?: string
  style?: ViewStyle
}

/**
 * @interface LoadingOverlayProps
 * @description Props for the full-screen loading overlay component
 *
 * @property {boolean} visible - Whether the overlay is visible
 * @property {string} message - Optional loading message to display
 * @property {string} color - Color of the spinner (default: #393939)
 * @property {boolean} transparent - Whether the overlay background is transparent (default: false)
 */
interface LoadingOverlayProps {
  visible: boolean
  message?: string
  color?: string
  transparent?: boolean
}

/**
 * @interface InlineLoadingProps
 * @description Props for inline loading component
 *
 * @property {string} message - Loading message to display
 * @property {number} size - Size of the spinner (default: 16)
 * @property {string} color - Color of the spinner (default: #393939)
 * @property {ViewStyle} style - Additional styles for the container
 * @property {TextStyle} textStyle - Additional styles for the text
 */
interface InlineLoadingProps {
  message?: string
  size?: number
  color?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

/**
 * @component LoadingSpinner
 * @description Basic animated loading spinner component
 *
 * @example
 * <LoadingSpinner size={32} color="#0EA5E9" />
 *
 * @props {LoadingSpinnerProps} props - Component props
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = "#393939",
  style
}) => {
  const rotation = useSharedValue(0)

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear
      }),
      -1
    )
  }, [rotation])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }]
    }
  })

  return (
    <View className="items-center justify-center" style={style}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: 25,
            borderColor: `${color}20`,
            borderTopColor: color,
            borderWidth: Math.max(2, size / 12)
          },
          animatedStyle
        ]}
      />
    </View>
  )
}

/**
 * @component LoadingOverlay
 * @description Full-screen loading overlay with optional message
 *
 * @example
 * <LoadingOverlay
 *   visible={isLoading}
 *   message="Loading your data..."
 * />
 *
 * @props {LoadingOverlayProps} props - Component props
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  color = "#393939",
  transparent = false
}) => {
  const opacity = useSharedValue(0)

  React.useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease)
    })
  }, [visible, opacity])

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  if (!visible) return null

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View
        style={[
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: transparent ? "transparent" : "rgba(0, 0, 0, 0.5)"
          },
          animatedContainerStyle
        ]}
      >
        <View className="min-w-30 items-center justify-center rounded-2xl bg-white p-8 shadow-lg">
          <LoadingSpinner size={48} color={color} />
          {message && (
            <Text
              className="mt-6 text-center font-medium text-base"
              style={{ color }}
            >
              {message}
            </Text>
          )}
        </View>
      </Animated.View>
    </Modal>
  )
}

/**
 * @component InlineLoading
 * @description Inline loading component for smaller UI elements
 *
 * @example
 * <InlineLoading message="Loading..." size={20} />
 *
 * @props {InlineLoadingProps} props - Component props
 */
export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = "Loading...",
  size = 16,
  color = "#393939",
  style,
  textStyle
}) => {
  return (
    <View className="flex-row items-center justify-center py-2" style={style}>
      <LoadingSpinner size={size} color={color} />
      {message && (
        <Text
          className="ml-2 font-medium text-sm"
          style={[{ color }, textStyle]}
        >
          {message}
        </Text>
      )}
    </View>
  )
}

/**
 * @component PulsingDots
 * @description Alternative loading animation with pulsing dots
 *
 * @example
 * <PulsingDots color="#0EA5E9" />
 *
 * @props {Omit<LoadingSpinnerProps, 'size'>} props - Component props (excluding size)
 */
export const PulsingDots: React.FC<Omit<LoadingSpinnerProps, "size">> = ({
  color = "#393939",
  style
}) => {
  const dot1Scale = useSharedValue(1)
  const dot2Scale = useSharedValue(1)
  const dot3Scale = useSharedValue(1)

  React.useEffect(() => {
    // biome-ignore lint/suspicious/noExplicitAny: I don't know the type of dotScale
    const animate = (dotScale: any) => {
      dotScale.value = withRepeat(
        withTiming(1.5, {
          duration: 600,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      )
    }

    // Stagger the animations
    animate(dot1Scale)
    setTimeout(() => animate(dot2Scale), 200)
    setTimeout(() => animate(dot3Scale), 400)
  }, [dot1Scale, dot2Scale, dot3Scale])

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot1Scale.value }]
  }))

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot2Scale.value }]
  }))

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot3Scale.value }]
  }))

  return (
    <View className="flex-row items-center justify-center" style={style}>
      <Animated.View
        style={[
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 2,
            backgroundColor: color
          },
          dot1Style
        ]}
      />
      <Animated.View
        style={[
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 2,
            backgroundColor: color
          },
          dot2Style
        ]}
      />
      <Animated.View
        style={[
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 2,
            backgroundColor: color
          },
          dot3Style
        ]}
      />
    </View>
  )
}

// Default export for convenience
export default LoadingSpinner
