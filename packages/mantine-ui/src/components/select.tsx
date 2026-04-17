import type { SelectProps as MantineSelectProps } from "@mantine/core"
import { Select } from "@mantine/core"
import type { ReactElement } from "react"

interface SelectProps
  extends Omit<MantineSelectProps, "label" | "data" | "onChange" | "value"> {
  label: string
  value: boolean | null
  onChange: (value: boolean | null) => void
  disabled?: boolean
  readOnly?: boolean
  error?: string
  withAsterisk?: boolean
}

export default function NewSelect({
  label,
  value,
  onChange,
  disabled,
  readOnly,
  error,
  withAsterisk,
  ...props
}: SelectProps): ReactElement {
  const data = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" }
  ]

  return (
    <Select
      label={label}
      value={value === null ? "" : value ? "true" : "false"}
      onChange={(v) => {
        if (v === "true") onChange(true)
        if (v === "false") onChange(false)
      }}
      data={data}
      disabled={disabled}
      readOnly={readOnly}
      error={error}
      withAsterisk={withAsterisk}
      {...props}
    />
  )
}
