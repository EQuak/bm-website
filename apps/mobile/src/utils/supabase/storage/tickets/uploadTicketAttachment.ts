import * as FileSystem from "expo-file-system/legacy"
import { supabase } from "../../client"

const BUCKET_NAME = "ticket_attachments"
const FILE_NAME_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const FILE_NAME_LENGTH = 10

/**
 * Generate a random string using Math.random() (React Native compatible)
 * This is a non-cryptographic random generator suitable for file naming
 */
const generateRandomId = (): string => {
  let result = ""
  for (let i = 0; i < FILE_NAME_LENGTH; i++) {
    result += FILE_NAME_ALPHABET.charAt(
      Math.floor(Math.random() * FILE_NAME_ALPHABET.length)
    )
  }
  return result
}

/**
 * Upload a file attachment to Supabase storage
 * @param fileUri - URI of the file from image picker or document picker
 * @param fileName - Original filename with extension
 * @param mimeType - MIME type of the file
 * @param storageFolderKey - Folder key for organizing files in storage (ticket ID or reference)
 * @returns Promise with upload result containing id and path
 */
export const uploadTicketAttachment = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
  storageFolderKey: string
) => {
  // Extract extension from filename
  let extension = fileName.split(".").pop()

  // Some times the extension is svg+xml, so we need to remove the +xml
  if (extension?.includes("+xml")) {
    extension = extension.replace("+xml", "")
  }

  // Generate unique filename
  const uniqueFileName = `${storageFolderKey}/${generateRandomId()}.${extension}`

  // Read file as base64 using legacy FileSystem API (still works, just deprecated)
  // TODO: Migrate to new File API when stable documentation is available
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64
  })

  // Convert base64 to Uint8Array for React Native compatibility
  // React Native doesn't have Blob, so we use Uint8Array which Supabase accepts
  // Use a polyfill-safe base64 decode that works in React Native
  const base64ToUint8Array = (base64: string): Uint8Array => {
    // In React Native, we can use Buffer if available, or manually decode
    if (typeof Buffer !== "undefined") {
      return new Uint8Array(Buffer.from(base64, "base64"))
    }

    // Fallback: manual base64 decode using atob if available
    // React Native/expo might have atob polyfilled
    try {
      const binaryString = atob(base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes
    } catch {
      // If atob is not available, throw a helpful error
      throw new Error(
        "Base64 decoding not available. Please ensure a polyfill is installed."
      )
    }
  }

  const bytes = base64ToUint8Array(base64)

  // Upload to Supabase storage
  // Supabase Storage accepts ArrayBuffer, Blob, File, or FormData
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(uniqueFileName, bytes, {
      contentType: mimeType,
      upsert: false
    })

  if (error) {
    console.error("Error uploading ticket attachment", error)
    throw error
  }

  return data
}

