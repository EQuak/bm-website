"use client"

import { Loader } from "@repo/mantine-ui"
import { cn } from "@repo/mantine-ui/utils/cn"
import type { LinkProps as NextLinkProps } from "next/link"
import NextLink, { useLinkStatus } from "next/link"
import { forwardRef } from "react"

import { useApp } from "#/core/context/AppContext"
import { DEFAULT_ROUTE_PATH } from "../config/routes"

interface WorkspaceLinkProps extends NextLinkProps {
  href:
    | string
    | {
        pathname: string
        query?: Record<string, string>
      }
  children?: React.ReactNode
  className?: string | string[]
  onMouseEnter?: () => void
  onTouchStart?: () => void
  onTouchEnd?: () => void
  onMouseLeave?: () => void
  onTouchCancel?: () => void
  withLoading?: boolean
}

const WorkspaceLink = forwardRef<HTMLAnchorElement, WorkspaceLinkProps>(
  ({ href, withLoading = false, ...props }, ref) => {
    const { orgSlug } = useApp()
    const base = `${DEFAULT_ROUTE_PATH}/${orgSlug}`

    return (
      <NextLink
        href={
          typeof href === "string"
            ? `${base}${href.startsWith("/") ? href : `/${href}`}`
            : {
                pathname: `${base}${href.pathname.startsWith("/") ? href.pathname : `/${href.pathname}`}`,
                query: { ...href.query }
              }
        }
        {...props}
        className={cn(props.className)}
        ref={ref}
      >
        {props.children}
        {withLoading && <NavigationIsLoading />}
      </NextLink>
    )
  }
)

WorkspaceLink.displayName = "WorkspaceLink"

export default WorkspaceLink

function NavigationIsLoading() {
  const { pending } = useLinkStatus()
  if (!pending) return null
  return (
    <div className="ml-2 flex h-full items-center justify-center">
      <Loader size={12} type="dots" />
    </div>
  )
}
