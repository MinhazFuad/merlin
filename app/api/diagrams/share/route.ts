import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { SHARE_SLUG_LENGTH } from '@/lib/constants'
import { z } from 'zod'

const shareRequestSchema = z.object({
  diagramId: z
    .string()
    .min(1, 'diagramId is required')
    .max(100, 'diagramId must be 100 characters or fewer')
    .trim(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const parseResult = shareRequestSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.issues[0]?.message ?? 'Invalid request payload' },
      { status: 400 }
    )
  }

  const { diagramId } = parseResult.data

  // Verify ownership
  const { data: diagram } = await supabase
    .from('diagrams')
    .select('id, share_slug, is_public')
    .eq('id', diagramId)
    .eq('user_id', user.id)
    .single()

  if (!diagram) {
    return NextResponse.json({ error: 'Diagram not found' }, { status: 404 })
  }

  // Reuse existing slug if present
  if (diagram.share_slug) {
    // Just ensure is_public is true
    await supabase
      .from('diagrams')
      .update({ is_public: true })
      .eq('id', diagramId)
    return NextResponse.json({ slug: diagram.share_slug })
  }

  // Generate a unique slug (retry on collision)
  const serviceClient = await createServiceClient()
  let slug: string | null = null
  let attempts = 0

  while (!slug && attempts < 5) {
    const candidate = nanoid(SHARE_SLUG_LENGTH)
    const { error } = await serviceClient
      .from('diagrams')
      .update({ share_slug: candidate, is_public: true })
      .eq('id', diagramId)

    if (!error) {
      slug = candidate
    }
    attempts++
  }

  if (!slug) {
    return NextResponse.json({ error: 'Failed to generate slug' }, { status: 500 })
  }

  return NextResponse.json({ slug })
}
