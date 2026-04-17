"use client"

import { useEffect, useState } from "react"

/**
 * Global Error Boundary
 *
 * This component catches errors in the root layout.
 * It MUST include its own <html> and <body> tags because
 * the root layout may have failed.
 *
 * IMPORTANT:
 * - Cannot use Mantine UI or other providers (they may have failed)
 * - Cannot use React hooks that depend on providers
 * - Must use inline styles for styling
 */
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [copied, setCopied] = useState(false)
  const errorId = error.digest ?? "unknown"
  const timestamp = new Date().toISOString()

  useEffect(() => {
    // Log to console
    console.error("[Global Error]", error)
  }, [error])

  const handleCopy = async () => {
    const errorDetails = JSON.stringify(
      {
        timestamp,
        errorId,
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "An unexpected error occurred",
        environment: process.env.NODE_ENV,
        ...(process.env.NODE_ENV === "development" && error.stack
          ? { stack: error.stack }
          : {})
      },
      null,
      2
    )

    try {
      await navigator.clipboard.writeText(errorDetails)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard may not be available
    }
  }

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            maxWidth: "500px"
          }}
        >
          {/* Error Icon (simple SVG) */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc3545"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: "20px" }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>

          {/* Title */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#212529",
              marginBottom: "12px"
            }}
          >
            Something went wrong
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "14px",
              color: "#6c757d",
              marginBottom: "24px",
              lineHeight: 1.5
            }}
          >
            We encountered a critical error. Please try again or contact support
            if the problem persists.
          </p>

          {/* Error ID */}
          <p
            style={{
              fontSize: "12px",
              color: "#868e96",
              marginBottom: "24px",
              fontFamily: "monospace"
            }}
          >
            Error ID: {errorId.slice(0, 8)}...
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}
          >
            <button
              onClick={handleCopy}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 500,
                color: copied ? "#fff" : "#495057",
                backgroundColor: copied ? "#20c997" : "#e9ecef",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {copied ? "Copied!" : "Copy Error Details"}
            </button>

            <button
              onClick={reset}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#fff",
                backgroundColor: "#228be6",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Try Again
            </button>
          </div>

          {/* Stack trace in development */}
          {process.env.NODE_ENV === "development" && error.stack && (
            <pre
              style={{
                marginTop: "24px",
                padding: "16px",
                backgroundColor: "#212529",
                color: "#f8f9fa",
                borderRadius: "6px",
                fontSize: "11px",
                textAlign: "left",
                overflow: "auto",
                maxHeight: "200px"
              }}
            >
              {error.stack}
            </pre>
          )}
        </div>
      </body>
    </html>
  )
}
