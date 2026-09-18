import { Suspense } from 'react'
import { AuthPageLayout } from '@/components/auth/AuthPageLayout'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg)]" />}>
      <AuthPageLayout initialMode="login" />
    </Suspense>
  )
}
