import type { UseFormReturnType } from "@repo/mantine-ui"
import { Button, Group, Stack, TextInput } from "@repo/mantine-ui"
import { IconRefresh } from "@repo/mantine-ui/icons/index"
import type { UserRoleFormSchemaType } from "./form.type"
import UserRoleActions from "./UserRoleActions"

export default function UserRoleFormInputs({
  form,
  mode
}: {
  form: UseFormReturnType<UserRoleFormSchemaType>
  mode: "create" | "edit" | "view" | "list"
}) {
  return (
    <Stack>
      <Stack>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Enter user role name"
          {...form.getInputProps("data.role.name")}
          disabled={mode === "view" || mode === "edit"}
        />
      </Stack>
      <UserRoleActions form={form} mode={mode} />
      {mode !== "view" && (
        <Group gap="sm" wrap="wrap">
          <Button
            type="button"
            color="orange"
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={() => {
              // // Get the current states object to keep it intact
              // const currentStates = form.getInputProps("states").value

              // // Reset only the form data fields
              // form.setValues({
              //   states: currentStates, // Preserve current state including createDepartmentDrawer
              //   data: userRoleFormInitialValues.data // Reset only the form's data fields
              // })
              form.reset()
            }}
          >
            Reset
          </Button>
          <Button type="submit" loading={form.getValues().states.loading}>
            Save User Role
          </Button>
        </Group>
      )}
    </Stack>
  )
}
