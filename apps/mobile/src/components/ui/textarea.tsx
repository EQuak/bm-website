import { Platform, TextInput, type TextInputProps } from "react-native"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  multiline = true,
  numberOfLines = Platform.select({ web: 4, native: 6 }),
  placeholderClassName,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "min-h-20 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-gray-900",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
        "placeholder:text-gray-500",
        "disabled:bg-gray-50 disabled:opacity-50",
        className
      )}
      placeholderClassName={cn("text-gray-500", placeholderClassName)}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      {...props}
    />
  )
}

export { Textarea }
