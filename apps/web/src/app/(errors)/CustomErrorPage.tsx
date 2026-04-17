"use client"

import { Button, Center, Stack } from "@repo/mantine-ui"
import Head from "next/head"
import { useRouter } from "next/navigation"

import {
  Custom400Logo,
  Custom401Logo,
  Custom403Logo,
  Custom404Logo,
  Custom408Logo,
  Custom429Logo,
  Custom500Logo,
  Custom502Logo,
  Custom503Logo,
  Custom504Logo
} from "#/assets/icons"

export interface ErrorPageProps {
  canRefresh?: boolean
  errorStatus?: string
}

export function CustomErrorPage({
  canRefresh = true,
  errorStatus
}: ErrorPageProps) {
  const router = useRouter()

  // Default icon and message
  let icon = <div></div>
  let description = "Unknown"
  let message = "Unknown Error. Please contact IT"

  // Dynamically set icon and message based on errorStatus
  switch (errorStatus) {
    case "400":
      icon = <Custom400Logo />
      description = "400 Bad Request"
      message =
        "The server could not understand the request due to invalid syntax. Please check the URL or request parameters and try again."
      break
    case "401":
      icon = <Custom401Logo />
      description = "401 Unauthorized"
      message =
        "Access denied. You do not have the necessary credentials to access this resource. Please log in with an authorized user and try again."
      break
    case "403":
      icon = <Custom403Logo />
      description = "403 Forbidden"
      message =
        "You do not have permission to access this resource. If you believe this is an error, please contact the system administrator."
      break
    case "404":
      icon = <Custom404Logo />
      description = "404 Not Found"
      message =
        "The page or resource you are looking for was not found. Please check the URL and try again or return to the homepage."
      break
    case "408":
      icon = <Custom408Logo />
      description = "408 Request Timeout"
      message =
        "The server timed out waiting for the request. Please reload the page or try again later."
      break
    case "429":
      icon = <Custom429Logo />
      description = "429 Too Many Requests"
      message =
        "You have sent too many requests in a short period of time. Please wait a moment before trying again."
      break
    case "500":
      icon = <Custom500Logo />
      description = "500 Internal Server Error"
      message =
        "The server encountered an internal error and could not complete your request. Please try again later or contact technical support."
      break
    case "502":
      icon = <Custom502Logo />
      description = "502 Bad Gateway"
      message =
        "The server, acting as a gateway or proxy, received an invalid response from the upstream server. Please reload the page or come back later."
      break
    case "503":
      icon = <Custom503Logo />
      description = "503 Service Unavailable"
      message =
        "The server is temporarily unavailable, usually due to maintenance or overload. Please try again later."
      break
    case "504":
      icon = <Custom504Logo />
      description = "504 Gateway Timeout"
      message =
        "The server, acting as a gateway or proxy, did not receive a timely response from the upstream server. Please reload the page or try again later."
      break
    default:
      icon = <></>
      description = "Unknown"
      message = "Unknown Error. Please contact IT"
      break
  }

  return (
    <>
      <Head>
        <title>{description}</title>
      </Head>
      <Center h={"100vh"}>
        <Stack align={"center"} className={"max-w-lg px-10"}>
          {icon}
          <span
            className={
              "font-bold font-heading font-weight-bold text-3xl md:text-5xl"
            }
          >
            {description}
          </span>
          <span className={"text-center text-md"}>{message}</span>
          {canRefresh && (
            <Button onClick={() => router.refresh()}>Reload</Button>
          )}
        </Stack>
      </Center>
    </>
  )
}
