import { z } from 'zod'

/**
 * Security limits based on RFC standards and cryptographic recommendations:
 * - RFC 5321: Maximum email length is 254 characters.
 * - Bcrypt: Has a 72-byte limit; capping password to 72 characters prevents Hash-DoS
 *   (Denial of Service via massive strings causing high CPU hashing exhaustion).
 */
export const MAX_EMAIL_LENGTH = 254
export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 72

// Control characters regex (null bytes, carriage control, etc.)
const DANGEROUS_CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g

/**
 * Sanitizes an email string:
 * - Strips control characters and null bytes
 * - Trims whitespace
 * - Normalizes to lowercase
 */
export function sanitizeEmail(raw: string): string {
  if (typeof raw !== 'string') return ''
  return raw.replace(DANGEROUS_CONTROL_CHARS, '').trim().toLowerCase()
}

/**
 * Sanitizes an error message reflected from URL parameters:
 * - Removes URLs to prevent phishing links from being displayed on trusted pages
 * - Strips angle brackets to prevent HTML/XSS injection
 * - Strips control characters
 * - Caps length to prevent UI overflow and layout breaking
 */
export function sanitizeErrorMessage(raw: string | null): string {
  if (!raw || typeof raw !== 'string') return ''
  try {
    const decoded = decodeURIComponent(raw)
    const clean = decoded.replace(DANGEROUS_CONTROL_CHARS, '').trim()

    // Phishing protection: reject error messages that contain URLs or protocol schemes
    if (/https?:\/\/|\/\/|www\.|\.com|\.org|\.net|\.xyz|\.app|javascript:|data:/i.test(clean)) {
      return 'An authentication error occurred. Please try again.'
    }

    // Strip angle brackets and excessive quotes
    const stripped = clean.replace(/[<>"']/g, '').trim()
    return stripped.slice(0, 120)
  } catch {
    return 'An authentication error occurred. Please try again.'
  }
}

/**
 * Validates and sanitizes a redirect target to prevent Open Redirect attacks.
 * Disallows:
 * - Absolute URLs (https://attacker.com)
 * - Protocol-relative URLs (//attacker.com)
 * - Backslash bypasses (/\attacker.com or \\attacker.com)
 * - URL schemes (javascript:, data:)
 * - Control characters
 */
export function sanitizeRedirectUrl(url: string | null, fallback = '/dashboard'): string {
  if (!url || typeof url !== 'string') return fallback
  const trimmed = url.trim()

  // Must begin with a single slash, followed by an alphanumeric character or slash-free path
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.startsWith('\\') ||
    trimmed.includes(':') ||
    DANGEROUS_CONTROL_CHARS.test(trimmed)
  ) {
    return fallback
  }

  return trimmed
}

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(MAX_EMAIL_LENGTH, `Email must be ${MAX_EMAIL_LENGTH} characters or fewer`)
  .email('Please enter a valid email address')
  .transform((val) => sanitizeEmail(val))

export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(MAX_PASSWORD_LENGTH, `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer`)

export const signupPasswordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  .max(MAX_PASSWORD_LENGTH, `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer`)

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export const signupSchema = z.object({
  email: emailSchema,
  password: signupPasswordSchema,
})
