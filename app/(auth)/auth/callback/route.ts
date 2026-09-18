import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sanitizeRedirectUrl, sanitizeErrorMessage } from '@/lib/validators/auth'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : origin

  if (error) {
    const errorMsg = encodeURIComponent(sanitizeErrorMessage(errorDescription || error))
    return NextResponse.redirect(new URL(`/login?error=${errorMsg}`, baseUrl))
  }

  // Defend against Open Redirect attacks
  const safeNext = sanitizeRedirectUrl(next, '/dashboard')

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return NextResponse.redirect(new URL(safeNext, baseUrl))
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', baseUrl))
}
