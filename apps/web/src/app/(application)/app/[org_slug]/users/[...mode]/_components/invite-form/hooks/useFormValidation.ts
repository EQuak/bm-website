import { useState } from "react"
import { z } from "zod/v4"

type UtilsType = {
  profiles: {
    checkEmailExists: {
      fetch: (input: { email: string; organizationId: string }) => Promise<{
        exists: boolean
        employeeName?: string
      }>
    }
  }
}

export const getErrorMessage = (errors: unknown[]): string => {
  return errors
    .map((error) => {
      if (typeof error === "string") return error
      if (error && typeof error === "object" && "message" in error) {
        return (error as { message: string }).message
      }
      return String(error)
    })
    .join(", ")
}

export const profileValidators = {
  aclRole: z.string().min(1, "Role is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number")
}

export const useAsyncEmailValidation = (
  utils: UtilsType,
  organizationId: string
) => {
  const [emailError, setEmailError] = useState<string | null>(null)

  const validateEmail = async (email: string) => {
    if (!email || !z.email().safeParse(email).success) {
      setEmailError(null)
      return
    }

    try {
      const result = await utils.profiles.checkEmailExists.fetch({
        email,
        organizationId
      })
      if (result.exists) {
        setEmailError(
          `This email is already registered to ${result.employeeName}`
        )
      } else {
        setEmailError(null)
      }
    } catch (error) {
      setEmailError("Unable to verify email availability: " + error)
    }
  }

  const clearEmailError = () => {
    setEmailError(null)
  }

  return {
    emailError,
    validateEmail,
    clearEmailError
  }
}
