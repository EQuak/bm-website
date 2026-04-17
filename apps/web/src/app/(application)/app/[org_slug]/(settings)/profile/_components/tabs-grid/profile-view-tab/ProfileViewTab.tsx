"use client"

import { profilesSchema } from "@repo/db/schema"
import {
  Button,
  Group,
  modals,
  mtnZodResolver,
  notifications,
  Stack,
  Tabs,
  Text,
  TextInput,
  useForm
} from "@repo/mantine-ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useApp } from "#/core/context/AppContext"
import { api } from "#/trpc/react"
import { uploadProfileAvatar } from "#/utils/supabase/storage/uploadProfileAvatar"
import type { ProfilePageForm, ProfilePageMode } from "./profilePage.type"
import {
  profilePageFormInitialValues,
  profilePageFormSchemaUpdateValidation
} from "./profilePage.type"
import UploadProfileButton from "./UploadProfileButton"

export function ProfileViewTab({
  value
}: {
  value: NonNullable<ProfilePageMode>
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const editMode = searchParams.get("editMode")
  const { organizationId } = useApp()
  const utils = api.useUtils()
  const loggedInQueryInput = { organizationId }
  const [profile] =
    api.profiles.getProfileByUserLogged.useSuspenseQuery(loggedInQueryInput)
  const [originalProfile] = useState(profile)
  const [file, setFile] = useState<File | null>(null)

  const updateProfile = api.profiles.updateProfile.useMutation({
    onError: () => {
      utils.profiles.getProfileByUserLogged.setData(
        loggedInQueryInput,
        originalProfile
      )
    },
    onSettled: async () => {
      await utils.profiles.getProfileByUserLogged.invalidate(loggedInQueryInput)
    }
  })

  const setProfileApiData = async (data: ProfilePageForm) => {
    const oldData =
      utils.profiles.getProfileByUserLogged.getData(loggedInQueryInput)
    if (!oldData) return
    const newData = {
      ...oldData,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      avatar: data.avatar
    }
    utils.profiles.getProfileByUserLogged.setData(loggedInQueryInput, newData)
  }

  const resetProfile = () => {
    utils.profiles.getProfileByUserLogged.setData(
      loggedInQueryInput,
      originalProfile
    )
  }

  const setEditMode = (value: boolean) => {
    router.push(`${pathname}?editMode=${value}`)
  }

  const form = useForm<ProfilePageForm>({
    name: "profilePageForm",
    initialValues: {
      ...profilePageFormInitialValues,
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      email: profile?.user?.email ?? "",
      phone: profile?.phone ?? "",
      avatar: profile?.avatar ?? ""
    },
    validate: mtnZodResolver(profilePageFormSchemaUpdateValidation),
    enhanceGetInputProps: (props) => ({
      ...props,
      disabled: loading,
      readOnly: editMode !== "true"
    }),
    onValuesChange: (values) => {
      setProfileApiData(values)
    }
  })

  const handleReset = () => {
    resetProfile()
    form.reset()
  }

  const updateProfileSubmit = async (values: ProfilePageForm) => {
    try {
      setLoading(true)
      const id = profile?.id
      if (!id) {
        throw new Error("Profile not found")
      }

      // If file, upload the file to supabase storage and get the public url
      if (file) {
        const publicUrl = await uploadProfileAvatar(file, id)
        values.avatar = publicUrl
      }

      const parsedValues = profilesSchema.update.safeParse(values)
      if (!parsedValues.success) {
        throw new Error("Invalid values")
      }
      await updateProfile.mutateAsync({
        organizationId,
        data: {
          firstName: parsedValues.data.firstName,
          lastName: parsedValues.data.lastName,
          phone: parsedValues.data.phone,
          avatar: values.avatar
        },
        where: { id }
      })

      setEditMode(false)

      notifications.show({
        title: "Profile updated",
        message: "Your profile has been updated",
        color: "teal"
      })
    } catch (error) {
      console.error(error)
      notifications.show({
        title: "Error",
        message: "An error occurred while updating your profile",
        color: "red"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: ProfilePageForm) => {
    modals.openConfirmModal({
      title: "Confirm Update",
      children: <Text>Are you sure you want to update your profile?</Text>,
      labels: {
        confirm: "Update",
        cancel: "Cancel"
      },
      onConfirm: () => {
        updateProfileSubmit(values)
      }
    })
  }

  useEffect(() => {
    if (file) {
      console.log("file", file)
      // if file, create a url and set to avatar
      const url = URL.createObjectURL(file)
      form.setFieldValue("avatar", url)
    }
  }, [file])

  return (
    <Tabs.Panel value={value}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {editMode === "true" && <UploadProfileButton setFile={setFile} />}
          <Group grow>
            <TextInput
              variant={editMode !== "true" ? "filled" : undefined}
              label="First Name"
              {...form.getInputProps("firstName")}
            />
            <TextInput
              variant={editMode !== "true" ? "filled" : undefined}
              label="Last Name"
              {...form.getInputProps("lastName")}
            />
          </Group>
          <TextInput
            variant={editMode !== "true" ? "filled" : undefined}
            label="Phone"
            {...form.getInputProps("phone")}
          />
          <TextInput
            label={editMode === "true" ? "Email (Not editable)" : "Email"}
            variant={"filled"}
            {...form.getInputProps("email")}
            readOnly
          />
          <Group justify="space-between">
            {editMode === "true" && (
              <Group>
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={() => {
                    setEditMode(false)
                    handleReset()
                  }}
                >
                  Cancel Editing
                </Button>
                <Button
                  disabled={!form.isDirty() || loading}
                  onClick={handleReset}
                  variant="outline"
                >
                  Undo Changes
                </Button>
              </Group>
            )}
            {editMode !== "true" && (
              <Button onClick={() => setEditMode(true)} disabled={loading}>
                Edit Profile
              </Button>
            )}
            {editMode === "true" && (
              <Button
                type="submit"
                disabled={!form.isDirty()}
                loading={loading}
              >
                Save Changes
              </Button>
            )}
          </Group>
        </Stack>
      </form>
    </Tabs.Panel>
  )
}
