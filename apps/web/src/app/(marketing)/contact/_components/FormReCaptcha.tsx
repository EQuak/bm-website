"use client"

import { forwardRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"

export interface FormReCaptchaProps {
  siteKey: string
  onToken: (token: string | null) => void
  onExpired?: () => void
  onError?: () => void
  className?: string
}

/**
 * Invisible reCAPTCHA v2 for form protection.
 * Use ref.executeAsync() to get a token before form submit.
 */
export const FormReCaptcha = forwardRef<ReCAPTCHA, FormReCaptchaProps>(
  ({ siteKey, onToken, onExpired, onError, className = "" }, ref) => (
    <div className={className}>
      <ReCAPTCHA
        ref={ref}
        sitekey={siteKey}
        size="invisible"
        onChange={onToken}
        onExpired={onExpired}
        onErrored={onError}
      />
      <p className="mt-2 text-base-content/50 text-xs">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover link text-xs"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover link text-xs"
        >
          Terms of Service
        </a>{" "}
        apply.
      </p>
    </div>
  )
)
FormReCaptcha.displayName = "FormReCaptcha"

export type { ReCAPTCHA }
