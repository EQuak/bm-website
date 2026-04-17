import { supabase } from "../client"

const DEFAULT_REFERENCE_MATERIAL_FILES_BUCKET = "reference_material_files"

export async function getReferenceMaterialUrl(path: string): Promise<string> {
  try {
    console.log("Attempting to get signed URL for path:", path)
    console.log("Using bucket:", DEFAULT_REFERENCE_MATERIAL_FILES_BUCKET)
    
    // Clean the path - remove any leading slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    console.log("Clean path:", cleanPath)
    
    // First, let's check if the file exists
    const directory = cleanPath.split('/').slice(0, -1).join('/') || ''
    const filename = cleanPath.split('/').pop() || ''
    console.log("Directory:", directory)
    console.log("Filename:", filename)
    
    const { data: listData, error: listError } = await supabase.storage
      .from(DEFAULT_REFERENCE_MATERIAL_FILES_BUCKET)
      .list(directory, {
        limit: 100,
        offset: 0,
        search: filename
      })
    
    if (listError) {
      console.error("Error listing files in directory:", listError)
    } else {
      console.log("Files in directory:", listData)
    }

    // Try to get signed URL first
    const { data, error } = await supabase.storage
      .from(DEFAULT_REFERENCE_MATERIAL_FILES_BUCKET)
      .createSignedUrl(cleanPath, 3600) // 1 hour expiry

    if (error) {
      console.error("Error creating signed URL:", error)
      console.error("Error details:", {
        message: error.message,
        name: error.name
      })
      
      // Fallback: try to get public URL
      console.log("Trying public URL as fallback...")
      const { data: publicData } = supabase.storage
        .from(DEFAULT_REFERENCE_MATERIAL_FILES_BUCKET)
        .getPublicUrl(cleanPath)
      
      if (publicData.publicUrl) {
        console.log("Successfully got public URL as fallback")
        return publicData.publicUrl
      }
      
      return ""
    }

    console.log("Successfully created signed URL")
    return data?.signedUrl ?? ""
  } catch (error) {
    console.error("Error getting reference material URL:", error)
    return ""
  }
}
