export const handleError = (functionName: string, error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error(
    `Error in ${functionName}: ` + JSON.stringify(errorMessage, null, 2)
  )
  throw error
}
