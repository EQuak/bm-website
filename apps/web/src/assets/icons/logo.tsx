"use client"

/**
 * Brand lockup: mark + “Company Logo” in one horizontal row (text does not wrap).
 * Long viewport scaling uses clamp; parent may use overflow-x-auto on very narrow viewports.
 */
import { cn } from "@repo/mantine-ui/utils/cn"

const MARK_VIEWBOX = "0 0 40 40"

const LOGO_LABEL = "Company Logo"

type LogoIconProps =
  | {
      /** Max width of the entire lockup (px). */
      width: number
      className?: string | string[]
    }
  | {
      /** Mark size (px); label text scales with it. */
      height: number
      className?: string | string[]
      maxWidth?: number
    }

function MarkSvg({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      className={cn("shrink-0 text-mtn-dark-7", className)}
      aria-hidden
      focusable="false"
    >
      <rect x="2" y="2" width="36" height="36" rx="10" fill="currentColor" />
      <g fill="white" fillOpacity={0.92}>
        <rect x="11" y="12" width="18" height="3" rx="1.5" />
        <rect x="11" y="18.5" width="14" height="3" rx="1.5" />
        <rect x="11" y="25" width="10" height="3" rx="1.5" />
      </g>
    </svg>
  )
}

export function LogoIcon(props: LogoIconProps) {
  const { className, ...rest } = props

  const isWidthProp = "width" in rest
  const maxWidthPx = isWidthProp ? rest.width : (rest.maxWidth ?? 360)
  const iconPx = isWidthProp
    ? Math.round(Math.min(44, maxWidthPx * 0.14))
    : rest.height
  const markSize = Math.max(32, Math.min(44, iconPx))

  return (
    <div
      role="img"
      aria-label={LOGO_LABEL}
      className={cn(
        "mx-auto flex w-max min-w-0 max-w-full flex-row items-center justify-center gap-2.5 sm:gap-3",
        className
      )}
      style={{ maxWidth: maxWidthPx }}
    >
      <MarkSvg size={markSize} />
      <span
        className={cn(
          "min-w-0 whitespace-nowrap font-semibold text-mtn-dark-8 leading-none tracking-tight",
          isWidthProp &&
            "text-[length:clamp(0.8125rem,2.4vw+0.35rem,1.125rem)] sm:text-[length:clamp(0.9375rem,1.8vw+0.4rem,1.25rem)]"
        )}
        style={
          !isWidthProp
            ? {
                fontSize: Math.max(
                  14,
                  Math.min(22, Math.round(markSize * 0.42))
                )
              }
            : undefined
        }
      >
        {LOGO_LABEL}
      </span>
    </div>
  )
}
