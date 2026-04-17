import type { RadioGroupProps } from "@mantine/core"
import { Flex, Radio } from "@mantine/core"

interface RadioSelectProps extends Omit<RadioGroupProps["children"], "label"> {
  label: string
  value: boolean | null
  onChange: (value: boolean | null) => void
  disabled?: boolean
  readOnly?: boolean
  error?: string
  withAsterisk?: boolean
}

export default function NewRadioSelect({
  label,
  value,
  onChange,
  disabled,
  readOnly,
  error,
  withAsterisk,
  ...props
}: RadioSelectProps) {
  return (
    <Radio.Group
      className="flex flex-col gap-2"
      label={label}
      value={value === null ? null : value ? "true" : "false"}
      onChange={(newValue: string | null) =>
        onChange(newValue === null ? null : newValue === "true")
      }
      error={error}
      withAsterisk={withAsterisk}
      readOnly={readOnly}
      {...props}
    >
      <Flex direction="column" pl="xs" className="gap-x-4 gap-y-2">
        <Radio
          classNames={{
            label: "pl-1"
          }}
          value="true"
          label="Yes"
          disabled={disabled}
        />
        <Radio
          classNames={{
            label: "pl-1"
          }}
          value="false"
          label="No"
          disabled={disabled}
        />
      </Flex>
    </Radio.Group>
  )
}
