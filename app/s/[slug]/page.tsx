import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SharedView } from '@/components/shared/SharedView'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('diagrams')
    .select('title')
    .eq('share_slug', slug)
    .eq('is_public', true)
    .single()

  return {
    title: data?.title ?? 'Shared diagram',
  }
}

export default async function SharedDiagramPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: diagram } = await supabase
    .from('diagrams')
    .select('id, title, code, theme, share_slug')
    .eq('share_slug', slug)
    .eq('is_public', true)
    .single()

  if (!diagram) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  return <SharedView diagram={diagram} user={user} />
}
