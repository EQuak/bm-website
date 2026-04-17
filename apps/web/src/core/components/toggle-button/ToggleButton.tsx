import type { ActionIconProps } from "@repo/mantine-ui"
import { ActionIcon, createPolymorphicComponent } from "@repo/mantine-ui"
import React, { forwardRef } from "react"

interface ToggleButtonProps extends Omit<ActionIconProps, "onChange"> {
  checked?: boolean
  onChange?: (active: boolean | string) => void
  value?: string
  type?: "toggle" | "radio"
}

const _ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ checked, onChange, value, type = "toggle", ...props }, ref) => {
    const handleClick = () => {
      if (type === "toggle") {
        onChange?.(!checked)
      } else {
        onChange?.(value ?? "")
      }
    }

    return (
      <ActionIcon
        ref={ref}
        variant={checked ? "filled" : "default"}
        {...props}
        onClick={handleClick}
      />
    )
  }
)

const ToggleButton = createPolymorphicComponent<"button", ToggleButtonProps>(
  _ToggleButton
)

interface ToggleButtonGroupProps {
  value?: string
  onChange?: (value: string) => void
  children: React.ReactNode
}

const Group: React.FC<ToggleButtonGroupProps> = ({
  value,
  onChange,
  children
}) => {
  const handleChange = (newValue: string) => {
    if (newValue === value) return
    onChange?.(newValue)
  }

  return (
    <ActionIcon.Group>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<ToggleButtonProps>(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: () => handleChange(child.props.value!)
          })
        }
        return child
      })}
    </ActionIcon.Group>
  )
}

// Modify this part
type ToggleButtonComponent = typeof ToggleButton & {
  Group: React.FC<ToggleButtonGroupProps>
}

const ToggleButtonWithGroup = ToggleButton as ToggleButtonComponent
ToggleButtonWithGroup.Group = Group

export { ToggleButtonWithGroup as ToggleButton }
