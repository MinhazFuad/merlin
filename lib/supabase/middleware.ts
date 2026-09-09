import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Session refresh helper for use in proxy.ts */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase credentials are not configured yet, skip session refresh
  if (!url || !key) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do not add logic between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard route — redirect to login if not authenticated
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
