import { supabase } from "../client"

const DEFAULT_EMPLOYEE_FILES_BUCKET = "employee_files"

export async function getEmployeeFileUrl(path: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(DEFAULT_EMPLOYEE_FILES_BUCKET)
      .createSignedUrl(path, 3600) // 1 hour expiry

    if (error) {
      console.error("Error creating signed URL:", error)
      return ""
    }

    return data?.signedUrl ?? ""
  } catch (error) {
    console.error("Error getting employee file URL:", error)
    return ""
  }
}
