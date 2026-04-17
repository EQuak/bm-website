"use client"
import { mtnZodResolver, notifications, useForm } from "@repo/mantine-ui"
import { useEffect } from "react"
import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"
import { api } from "#/trpc/react"
import type { UserRoleFormSchemaType } from "./form.type"
import {
  userRoleFormInitialValues,
  userRoleFormSchemaValidationCreate,
  userRoleFormSchemaValidationEdit
} from "./form.type"
import UserRoleFormInputs from "./UserRoleFormInputs"

type UserRoleFormProps = {
  mode: "edit" | "view" | "create" | "list"
  userRoleSlug?: string
}

export default function UserRoleForm(props: UserRoleFormProps) {
  const router = useWorkspaceRouter()
  const utils = api.useUtils()
  const form = useForm<UserRoleFormSchemaType>({
    validate: mtnZodResolver(
      props.mode === "create"
        ? userRoleFormSchemaValidationCreate
        : userRoleFormSchemaValidationEdit
    ),
    initialValues: {
      ...userRoleFormInitialValues,
      data: {
        ...userRoleFormInitialValues.data,
        permissions: userRoleFormInitialValues.data.permissions.map((p) => ({
          ...p,
          roleSlug: null
        }))
      }
    },
    enhanceGetInputProps: ({ form, field }) => ({
      readOnly:
        props.mode === "view" ||
        (props.mode === "edit" && field === "data.buildingCode"),
      disabled: userRoleData.isLoading || !form.initialized
    })
  })

  const userRoleData = api.aclsRoles.getAclsRoleBySlug.useQuery(
    {
      slug: props.userRoleSlug!
    },
    {
      enabled: !!props.userRoleSlug && props.mode !== "create"
    }
  )

  const userRoleDataPermissions =
    api.aclsRoles.getAclsRolesPermissions.useQuery(
      {
        roleSlug: props.userRoleSlug!
      },
      {
        enabled: !!props.userRoleSlug && props.mode !== "create"
      }
    )

  const createUserRole = api.aclsRoles.addAclsRole.useMutation({
    onSuccess: () => {
      utils.aclsRoles.getAllAclsRoles.invalidate()
      utils.aclsRoles.getAclsRolesPermissions.invalidate()
    }
  })
  const updateUserRolePermissions =
    api.aclsRoles.updateAclsRolePermissions.useMutation({
      onSuccess: () => {
        utils.aclsRoles.getAllAclsRoles.invalidate()
        utils.aclsRoles.getAclsRolesPermissions.invalidate()
      }
    })
  const createUserRolePermissions =
    api.aclsRoles.createAclsRolePermissions.useMutation({
      onSuccess: () => {
        utils.aclsRoles.getAllAclsRoles.invalidate()
        utils.aclsRoles.getAclsRolesPermissions.invalidate()
      }
    })

  const handleCreateUserRole = async (values: typeof form.values) => {
    if (props.mode !== "create") return
    try {
      form.setFieldValue("states.loading", true)

      const { role } = values.data
      // Generate slug from name
      const slug = role.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const userRoleResponse = await createUserRole.mutateAsync({
        name: role.name,
        slug: slug // Pass the generated slug
      })

      const newUserRole = userRoleResponse?.[0]

      if (!newUserRole) {
        throw new Error("Error creating user role")
      }

      // Create role permissions
      await createUserRolePermissions.mutateAsync({
        roleSlug: newUserRole.slug,
        permissions: values.data.permissions.map(
          ({ moduleKey, title, permissions, parentModuleKey }) => ({
            moduleKey,
            title,
            parentModuleKey,
            permissions: {
              actions: {
                view: permissions.actions.view ?? false,
                add: permissions.actions.add ?? false,
                edit: permissions.actions.edit ?? false
              }
            }
          })
        )
      })

      form.reset()
      notifications.show({
        title: "Success!",
        message: "The user role has been created successfully.",
        color: "green"
      })
      router.workspacePush(`/user-roles/list`)
    } catch (error) {
      notifications.show({
        title: "Error!",
        message:
          error instanceof Error
            ? error.message
            : "There was an error creating the user role.",
        color: "red"
      })
    } finally {
      form.setFieldValue("states.loading", false)
    }
  }

  const handleUpdateUserRole = async (values: typeof form.values) => {
    if (props.mode !== "edit") return
    try {
      form.setFieldValue("states.loading", true)
      await updateUserRolePermissions.mutateAsync({
        roleSlug: props.userRoleSlug!,
        permissions: values.data.permissions.map(
          ({ moduleKey, permissions }) => ({
            moduleKey,
            permissions: {
              actions: {
                view: permissions.actions.view ?? false,
                add: permissions.actions.add ?? false,
                edit: permissions.actions.edit ?? false
              }
            }
          })
        )
      })
      notifications.show({
        title: "Success!",
        message: "The user role permissions have been updated successfully.",
        color: "green"
      })
    } catch (_error) {
      notifications.show({
        title: "Error!",
        message: "There was an error updating the user role permissions.",
        color: "red"
      })
    } finally {
      form.setFieldValue("states.loading", false)
    }
  }

  const handleSubmit = async (values: typeof form.values) => {
    if (props.mode === "view") {
      return
    }
    if (props.mode === "create") {
      return handleCreateUserRole(values)
    }

    if (props.mode === "edit") {
      return handleUpdateUserRole(values)
    }
  }

  const handleSubmitErrors = (errors: typeof form.errors) => {
    console.log(errors)
  }

  useEffect(() => {
    if (form.initialized) return

    if (props.mode === "create") {
      return form.initialize({
        ...userRoleFormInitialValues,
        data: {
          ...userRoleFormInitialValues.data,
          permissions: userRoleFormInitialValues.data.permissions.map((p) => ({
            ...p,
            roleSlug: null
          }))
        }
      })
    }

    if (
      userRoleData.data &&
      userRoleDataPermissions.data &&
      props.userRoleSlug
    ) {
      form.initialize({
        states: {
          ...userRoleFormInitialValues.states,
          userRole: userRoleData.data
        },
        data: {
          ...userRoleFormInitialValues.data,
          role: userRoleData.data,
          permissions: (
            userRoleDataPermissions.data ??
            userRoleFormInitialValues.data.permissions
          ).map((p) => ({
            ...p,
            roleSlug: userRoleData.data?.slug ?? null
          }))
        }
      })
    }
  }, [
    userRoleData.data,
    userRoleDataPermissions.data,
    props.userRoleSlug,
    form.initialized
  ])

  const title =
    props.mode === "create"
      ? "Create User Role"
      : props.mode === "edit"
        ? `Editing User Role: ${props.userRoleSlug}`
        : `User Role Overview: ${props.userRoleSlug}`

  return (
    <TopPageWrapper pageTitle={title}>
      <form onSubmit={form.onSubmit(handleSubmit, handleSubmitErrors)}>
        <UserRoleFormInputs form={form} mode={props.mode} />
      </form>
    </TopPageWrapper>
  )
}
