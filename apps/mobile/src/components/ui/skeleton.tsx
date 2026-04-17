import { useEffect, useRef } from "react"
import { Animated, type View } from "react-native"
import { cn } from "#/lib/utils"

function Skeleton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      className={cn("rounded-md bg-gray-200", className)}
      style={{ opacity }}
      {...props}
    />
  )
}

export { Skeleton }
