import * as ImageManipulator from "expo-image-manipulator"

/**
 * Check if an image is in HEIC/HEIF format
 * @param fileName - File name to check
 * @param mimeType - MIME type to check
 * @returns true if the image is HEIC/HEIF format
 */
export const isHeicImage = (fileName: string, mimeType: string): boolean => {
  const fileNameLower = fileName.toLowerCase()
  const mimeTypeLower = mimeType.toLowerCase()

  return (
    fileNameLower.endsWith(".heic") ||
    fileNameLower.endsWith(".heif") ||
    mimeTypeLower === "image/heic" ||
    mimeTypeLower === "image/heif" ||
    mimeTypeLower.includes("heic") ||
    mimeTypeLower.includes("heif")
  )
}

/**
 * Convert HEIC/HEIF image to JPEG format
 * @param uri - URI of the HEIC image
 * @returns Promise with converted image URI and metadata
 */
export const convertHeicToJpeg = async (
  uri: string
): Promise<{ uri: string; width: number; height: number }> => {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [], // No transformations needed, just conversion
      {
        compress: 0.9, // Good quality (0-1)
        format: ImageManipulator.SaveFormat.JPEG
      }
    )

    return {
      uri: manipulatedImage.uri,
      width: manipulatedImage.width,
      height: manipulatedImage.height
    }
  } catch (error) {
    console.error("Error converting HEIC to JPEG:", error)
    throw new Error(
      "Failed to convert HEIC image. Please try selecting a different image."
    )
  }
}
