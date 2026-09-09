import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Diagrams',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: diagrams } = await supabase
    .from('diagrams')
    .select('id, title, code, theme, is_public, share_slug, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return <DashboardClient user={user} initialDiagrams={diagrams ?? []} />
}
