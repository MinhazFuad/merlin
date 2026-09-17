import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
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
    const errorMsg = encodeURIComponent(errorDescription || error)
    return NextResponse.redirect(`${baseUrl}/login?error=${errorMsg}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_failed`)
}
