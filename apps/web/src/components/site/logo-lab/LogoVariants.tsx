"use client"

import { Box, type BoxProps } from "@repo/mantine-ui"
import type { ReactNode } from "react"
import { useId } from "react"

type LogoProps = { size?: number } & Omit<BoxProps, "children">

function SvgWrap({
  size = 120,
  children,
  viewBox = "0 0 80 80",
  ...rest
}: LogoProps & {
  children: ReactNode
  viewBox?: string
}) {
  return (
    <Box
      component="span"
      style={{ display: "inline-flex", lineHeight: 0, ...rest.style }}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        focusable="false"
        aria-hidden
      >
        {children}
      </svg>
    </Box>
  )
}

/** 1 — Diagonal split: coral / wine (warm) */
export function LogoVariant1({ size = 120, ...rest }: LogoProps) {
  const id = useId().replace(/:/g, "")
  return (
    <SvgWrap size={size} {...rest}>
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="80" x2="80" y2="0">
          <stop stopColor="#fda4af" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <path d="M0 0 H80 V80 H0 Z" fill={`url(#${id}-a)`} />
      <path d="M0 0 L80 80 L80 0 Z" fill="#881337" opacity="0.95" />
      <text
        x="24"
        y="56"
        fill="#4c0519"
        fontSize="32"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
      >
        B
      </text>
      <text
        x="54"
        y="40"
        fill="#fff1f2"
        fontSize="32"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
      >
        M
      </text>
    </SvgWrap>
  )
}

/** 2 — Squircle: electric violet → indigo */
export function LogoVariant2({ size = 120, ...rest }: LogoProps) {
  const id = useId().replace(/:/g, "")
  return (
    <SvgWrap size={size} {...rest}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="80" y2="80">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#312e81" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="72" height="72" rx="22" fill={`url(#${id}-g)`} />
      <text
        x="40"
        y="52"
        textAnchor="middle"
        fill="#faf5ff"
        fontSize="30"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.12em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 3 — Wireframe: near-black + neon lime outline */
export function LogoVariant3({ size = 120, ...rest }: LogoProps) {
  return (
    <SvgWrap size={size} {...rest}>
      <rect x="6" y="6" width="68" height="68" rx="14" fill="#09090b" />
      <text
        x="40"
        y="54"
        textAnchor="middle"
        fill="none"
        stroke="#bef264"
        strokeWidth="3.5"
        fontSize="32"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.14em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 4 — Hex: sunset amber / rust */
export function LogoVariant4({ size = 120, ...rest }: LogoProps) {
  const id = useId().replace(/:/g, "")
  return (
    <SvgWrap size={size} {...rest}>
      <defs>
        <linearGradient id={`${id}-h`} x1="0" y1="40" x2="80" y2="40">
          <stop stopColor="#fcd34d" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <polygon
        points="40,6 70,22 70,58 40,74 10,58 10,22"
        fill={`url(#${id}-h)`}
        stroke="#7c2d12"
        strokeWidth="1.5"
      />
      <text
        x="40"
        y="50"
        textAnchor="middle"
        fill="#422006"
        fontSize="26"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.1em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 5 — Stacked: ocean slate + ice text */
export function LogoVariant5({ size = 120, ...rest }: LogoProps) {
  const id = useId().replace(/:/g, "")
  return (
    <SvgWrap size={size} {...rest}>
      <defs>
        <linearGradient id={`${id}-s`} x1="40" y1="0" x2="40" y2="80">
          <stop stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="64" height="64" rx="8" fill={`url(#${id}-s)`} />
      <text
        x="40"
        y="38"
        textAnchor="middle"
        fill="#e0f2fe"
        fontSize="28"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
      >
        B
      </text>
      <text
        x="40"
        y="62"
        textAnchor="middle"
        fill="#bae6fd"
        fontSize="20"
        fontWeight="800"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="0.35em"
      >
        M
      </text>
    </SvgWrap>
  )
}

/** 6 — Double frame: cream + brick */
export function LogoVariant6({ size = 120, ...rest }: LogoProps) {
  return (
    <SvgWrap size={size} {...rest}>
      <rect
        x="8"
        y="8"
        width="64"
        height="64"
        rx="6"
        fill="#fffbeb"
        stroke="#9a3412"
        strokeWidth="2.5"
      />
      <rect
        x="13"
        y="13"
        width="54"
        height="54"
        rx="3"
        fill="none"
        stroke="#fdba74"
        strokeWidth="1"
      />
      <line
        x1="40"
        y1="22"
        x2="40"
        y2="58"
        stroke="#c2410c"
        strokeWidth="1.5"
        opacity="0.75"
      />
      <text
        x="25"
        y="51"
        textAnchor="middle"
        fill="#7c2d12"
        fontSize="28"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
      >
        B
      </text>
      <text
        x="55"
        y="51"
        textAnchor="middle"
        fill="#c2410c"
        fontSize="28"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
      >
        M
      </text>
    </SvgWrap>
  )
}

/** 7 — Venn: cyan × violet */
export function LogoVariant7({ size = 120, ...rest }: LogoProps) {
  const id = useId().replace(/:/g, "")
  return (
    <SvgWrap size={size} {...rest}>
      <defs>
        <linearGradient id={`${id}-c1`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id={`${id}-c2`} x1="1" y1="0" x2="0" y2="1">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#6b21a8" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="40" r="26" fill={`url(#${id}-c1)`} opacity="0.95" />
      <circle cx="48" cy="40" r="26" fill={`url(#${id}-c2)`} opacity="0.88" />
      <text
        x="40"
        y="48"
        textAnchor="middle"
        fill="white"
        stroke="#1e293b"
        strokeWidth="2"
        paintOrder="stroke fill"
        fontSize="22"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.16em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 8 — Midnight disc + gold BM */
export function LogoVariant8({ size = 120, ...rest }: LogoProps) {
  return (
    <SvgWrap size={size} {...rest}>
      <circle cx="40" cy="40" r="36" fill="#0f172a" />
      <circle
        cx="40"
        cy="40"
        r="32"
        fill="none"
        stroke="#eab308"
        strokeWidth="2"
        opacity="0.5"
      />
      <text
        x="40"
        y="50"
        textAnchor="middle"
        fill="#facc15"
        fontSize="28"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.1em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 9 — Hot pink pill */
export function LogoVariant9({ size = 120, ...rest }: LogoProps) {
  const id = useId().replace(/:/g, "")
  return (
    <SvgWrap size={size} {...rest}>
      <defs>
        <linearGradient id={`${id}-p`} x1="0" y1="40" x2="80" y2="40">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#be185d" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="18"
        width="72"
        height="44"
        rx="22"
        fill={`url(#${id}-p)`}
      />
      <text
        x="40"
        y="50"
        textAnchor="middle"
        fill="white"
        fontSize="26"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.12em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 10 — Forest + mint */
export function LogoVariant10({ size = 120, ...rest }: LogoProps) {
  return (
    <SvgWrap size={size} {...rest}>
      <rect x="6" y="6" width="68" height="68" rx="16" fill="#14532d" />
      <text
        x="40"
        y="52"
        textAnchor="middle"
        fill="#bbf7d0"
        fontSize="30"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.14em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 11 — Sunburst + ink letters */
export function LogoVariant11({ size = 120, ...rest }: LogoProps) {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    const x2 = 40 + Math.cos(a) * 38
    const y2 = 40 + Math.sin(a) * 38
    return (
      <line
        key={i}
        x1="40"
        y1="40"
        x2={x2}
        y2={y2}
        stroke="#fde68a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    )
  })
  return (
    <SvgWrap size={size} {...rest}>
      <rect width="80" height="80" rx="12" fill="#1e1b4b" />
      {rays}
      <circle cx="40" cy="40" r="22" fill="#fafafa" />
      <text
        x="40"
        y="48"
        textAnchor="middle"
        fill="#1e1b4b"
        fontSize="22"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.14em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 12 — Offset card: teal + sand */
export function LogoVariant12({ size = 120, ...rest }: LogoProps) {
  return (
    <SvgWrap size={size} {...rest}>
      <rect x="14" y="10" width="52" height="52" rx="8" fill="#fef3c7" />
      <rect x="10" y="18" width="52" height="52" rx="8" fill="#0d9488" />
      <text
        x="36"
        y="52"
        textAnchor="middle"
        fill="#f0fdfa"
        fontSize="28"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.12em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 13 — Ring only + split-color letters */
export function LogoVariant13({ size = 120, ...rest }: LogoProps) {
  return (
    <SvgWrap size={size} {...rest}>
      <rect width="80" height="80" rx="12" fill="#fafafa" />
      <circle
        cx="40"
        cy="40"
        r="30"
        fill="none"
        stroke="#334155"
        strokeWidth="3"
      />
      <text
        x="29"
        y="50"
        textAnchor="middle"
        fill="#2563eb"
        fontSize="26"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
      >
        B
      </text>
      <text
        x="51"
        y="50"
        textAnchor="middle"
        fill="#ea580c"
        fontSize="26"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
      >
        M
      </text>
    </SvgWrap>
  )
}

/** 14 — Brutalist: black box, white BM, red rule */
export function LogoVariant14({ size = 120, ...rest }: LogoProps) {
  return (
    <SvgWrap size={size} {...rest}>
      <rect x="6" y="6" width="68" height="68" fill="#000" />
      <rect x="6" y="52" width="68" height="6" fill="#dc2626" />
      <text
        x="40"
        y="44"
        textAnchor="middle"
        fill="#fff"
        fontSize="32"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.08em"
      >
        BM
      </text>
    </SvgWrap>
  )
}

/** 15 — Soft lavender field + deep plum letters */
export function LogoVariant15({ size = 120, ...rest }: LogoProps) {
  const id = useId().replace(/:/g, "")
  return (
    <SvgWrap size={size} {...rest}>
      <defs>
        <linearGradient id={`${id}-lv`} x1="0" y1="0" x2="80" y2="80">
          <stop stopColor="#e9d5ff" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="72"
        height="72"
        rx="20"
        fill={`url(#${id}-lv)`}
      />
      <text
        x="40"
        y="52"
        textAnchor="middle"
        fill="#4c1d95"
        fontSize="30"
        fontWeight="900"
        fontFamily="var(--mantine-font-family), system-ui, sans-serif"
        letterSpacing="-0.14em"
      >
        BM
      </text>
    </SvgWrap>
  )
}
