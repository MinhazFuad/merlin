import { createClient } from '@/lib/supabase/server'
import { EditorClient } from '@/components/editor/EditorClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ diagramId: string }>
}): Promise<Metadata> {
  const { diagramId } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('diagrams')
    .select('title')
    .eq('id', diagramId)
    .single()

  return {
    title: data?.title ?? 'Editor',
  }
}

export default async function DiagramEditorPage({
  params,
}: {
  params: Promise<{ diagramId: string }>
}) {
  const { diagramId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch the diagram — user must own it
  const { data: diagram, error } = await supabase
    .from('diagrams')
    .select('id, title, code, theme, user_id')
    .eq('id', diagramId)
    .single()

  if (error || !diagram) notFound()

  // Prevent editing another user's diagram
  if (diagram.user_id !== user?.id) notFound()

  return (
    <EditorClient
      user={user}
      initialCode={diagram.code}
      initialTitle={diagram.title}
      initialTheme={diagram.theme}
      diagramId={diagram.id}
    />
  )
}
