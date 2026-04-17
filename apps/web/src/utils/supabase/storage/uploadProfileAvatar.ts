import { DEFAULT_PROFILE_AVATAR_BUCKET } from "#/core/config/storage"
import { supabaseBrowserClient } from "../client"

export const uploadProfileAvatar = async (file: File, userId: string) => {
  // Upload new avatar
  const fileName = `${userId}-${Date.now()}`
  const { error } = await supabaseBrowserClient.storage
    .from(DEFAULT_PROFILE_AVATAR_BUCKET)
    .upload(fileName, file)

  if (error) {
    throw error
  }

  // Get public URL
  const {
    data: { publicUrl }
  } = supabaseBrowserClient.storage
    .from(DEFAULT_PROFILE_AVATAR_BUCKET)
    .getPublicUrl(fileName, {
      transform: {
        width: 180,
        height: 180,
        quality: 75,
        resize: "cover"
      }
    })
  // Find all files with the userId prefix
  const { data: previousAvatars, error: previousAvatarsError } =
    await supabaseBrowserClient.storage
      .from(DEFAULT_PROFILE_AVATAR_BUCKET)
      .list(undefined, {
        search: userId
      })

  // If error, log but continue
  if (previousAvatarsError) {
    console.error("Error getting previous avatars:", previousAvatarsError)
  }

  // Remove all previous avatars
  if (previousAvatars) {
    const array = previousAvatars
      .map(({ name }) => name)
      .filter(name => name !== fileName)
    const { data, error: removeError } = await supabaseBrowserClient.storage
      .from(DEFAULT_PROFILE_AVATAR_BUCKET)
      .remove(array)
    if (removeError) {
      console.error("Error removing previous avatar:", removeError)
    }
    console.log(data)
  }

  return publicUrl
}
