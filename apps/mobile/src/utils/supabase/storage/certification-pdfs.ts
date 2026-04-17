/**
 * @file Certification PDF Storage Utilities
 * @module utils/supabase/storage/certification-pdfs
 * @description Utilities for accessing cached lift card PDFs from Supabase storage
 * @author Team TUC
 */

import { supabase } from "#/utils/supabase/client"

export type CertificationType = "forklift" | "boom" | "scissors"

// Storage bucket names for cached PDFs
const FORKLIFT_PDFS_BUCKET = "forklift_pdfs"
const BOOM_PDFS_BUCKET = "boom_pdfs"
const SCISSORS_PDFS_BUCKET = "scissors_pdfs"

function getBucketByType(type: CertificationType): string {
  switch (type) {
    case "forklift":
      return FORKLIFT_PDFS_BUCKET
    case "boom":
      return BOOM_PDFS_BUCKET
    case "scissors":
      return SCISSORS_PDFS_BUCKET
  }
}

/**
 * Builds the storage path for a lift card PDF
 * @param type - The type of lift card (forklift, boom, scissors)
 * @param profileId - The employee's profile ID
 * @param cardId - The lift card ID
 * @param variant - Either "view" or "print" variant of the PDF
 * @returns The storage path string
 */
export function buildPdfPath(
  type: CertificationType,
  profileId: string,
  cardId: string,
  variant: "view" | "print" = "view"
): string {
  // Path convention: {profileId}/{cardId}-{variant}.pdf
  return `${profileId}/${cardId}-${variant}.pdf`
}

/**
 * Gets a signed URL for a cached PDF from Supabase storage
 * @param type - The type of lift card (forklift, boom, scissors)
 * @param path - The storage path to the PDF
 * @param expiresInSeconds - URL expiration time in seconds (default: 5 minutes)
 * @returns Promise resolving to signed URL or null if not found
 */
export async function getCachedPdfSignedUrl(
  type: CertificationType,
  path: string,
  expiresInSeconds = 300
): Promise<string | null> {
  try {
    const bucket = getBucketByType(type)
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds)

    if (error) {
      console.error(`Error getting signed URL for ${type} PDF:`, error)
      return null
    }
    
    return data?.signedUrl ?? null
  } catch (error) {
    console.error(`Exception getting signed URL for ${type} PDF:`, error)
    return null
  }
}

/**
 * Checks if a PDF exists in storage
 * @param type - The type of lift card (forklift, boom, scissors)
 * @param path - The storage path to the PDF
 * @returns Promise resolving to true if PDF exists, false otherwise
 */
export async function checkPdfExists(
  type: CertificationType,
  path: string
): Promise<boolean> {
  try {
    const bucket = getBucketByType(type)
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.split("/").slice(0, -1).join("/"), {
        search: path.split("/").pop()
      })

    if (error) {
      console.error(`Error checking if ${type} PDF exists:`, error)
      return false
    }
    
    return (data ?? []).some((file) => file.name === path.split("/").pop())
  } catch (error) {
    console.error(`Exception checking if ${type} PDF exists:`, error)
    return false
  }
}

/**
 * Gets the certification type from card type string
 * @param cardType - The card type from the modal ("forklift", "boom-lift", "scissor-lift")
 * @returns The certification type for storage operations
 */
export function getCertificationTypeFromCardType(
  cardType: "forklift" | "boom-lift" | "scissor-lift"
): CertificationType {
  switch (cardType) {
    case "forklift":
      return "forklift"
    case "boom-lift":
      return "boom"
    case "scissor-lift":
      return "scissors"
  }
}
